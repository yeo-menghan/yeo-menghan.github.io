const $ = id => document.getElementById(id);
const fields = ['title', 'date', 'updatedDate', 'tags', 'category', 'description', 'github', 'link', 'excerpt', 'readTime'];
let session;
let articles = [];
let draft = null;
let dirty = false;
let previewTimer;
let previewSequence = 0;
let activeReview = null;
let isPublishing = false;
let busyActions = 0;

async function api(route, body) {
  const response = await fetch(route, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'X-Publisher-Token': session.token, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Request failed.');
  return result;
}

function notice(message, error = false) {
  $('notice').textContent = message;
  $('notice').className = `notice${error ? ' error' : ''}`;
  $('notice').hidden = !message;
}

async function action(button, callback) {
  busyActions++;
  document.querySelector('.workspace').inert = true;
  button.disabled = true;
  try { await callback(); }
  catch (error) { notice(error.message, true); }
  finally {
    busyActions--;
    document.querySelector('.workspace').inert = busyActions > 0;
    button.disabled = false;
  }
}

function setDirty(value) {
  dirty = value;
  $('save-status').textContent = value ? 'Unsaved changes' : 'Draft saved on this laptop';
}

function readEditor() {
  let extra;
  try { extra = JSON.parse($('extra-metadata').value || '{}'); }
  catch { throw new Error('Additional metadata must be valid JSON.'); }
  if (!extra || typeof extra !== 'object' || Array.isArray(extra)) throw new Error('Additional metadata must be a JSON object.');
  const metadata = { ...extra };
  for (const field of fields) {
    const value = $(field).value.trim();
    if (value) metadata[field] = field === 'tags' ? value.split(',').map(tag => tag.trim()).filter(Boolean) : value;
  }
  return { type: draft.type, slug: draft.slug, baseSha: draft.baseSha, metadata, content: $('content').value };
}

function renderList() {
  const query = $('search').value.toLowerCase();
  const type = $('collection-filter').value;
  const list = $('article-list');
  list.replaceChildren();
  const matches = articles.filter(item => (type === 'all' || item.type === type) && `${item.title} ${item.slug}`.toLowerCase().includes(query));
  for (const item of matches) {
    const button = document.createElement('button');
    const selected = item.type === draft?.type && item.slug === draft?.slug;
    button.className = `article-item${selected ? ' active' : ''}`;
    button.setAttribute('aria-current', selected ? 'true' : 'false');
    const title = document.createElement('strong');
    title.textContent = item.title;
    const meta = document.createElement('small');
    meta.textContent = `${item.type} · ${item.draft ? 'Local draft' : item.onMain ? 'On main' : 'Local checkout'}`;
    if (item.draft) meta.className = 'draft-dot';
    button.append(title, meta);
    button.addEventListener('click', () => action(button, () => openArticle(item)));
    list.append(button);
  }
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No matching articles.';
    list.append(empty);
  }
}

async function refreshList() {
  articles = await api('/api/articles');
  renderList();
}

async function refreshPreview() {
  if (!draft) return;
  const sequence = ++previewSequence;
  try {
    const result = await api('/api/preview', readEditor());
    if (sequence === previewSequence) $('preview').srcdoc = result.html;
  } catch (error) {
    if (sequence === previewSequence) notice(error.message, true);
  }
}

function populateEditor(article) {
  draft = article;
  $('welcome').hidden = true;
  $('editor').hidden = false;
  $('article-location').textContent = `${article.type} / ${article.slug}`;
  for (const field of fields) {
    const value = article.metadata[field];
    $(field).value = field === 'tags' ? (Array.isArray(value) ? value.join(', ') : '') : (value ?? '');
  }
  const extra = Object.fromEntries(Object.entries(article.metadata).filter(([key]) => !fields.includes(key)));
  $('extra-metadata').value = JSON.stringify(extra, null, 2);
  $('content').value = article.content;
  $('category-field').hidden = article.type !== 'notes';
  $('description-field').hidden = article.type !== 'projects';
  $('project-fields').hidden = article.type !== 'projects';
  $('opinion-fields').hidden = article.type !== 'opinions';
  $('load-main').disabled = false;
  $('review').disabled = session.branch !== 'publisher';
  dirty = false;
  $('save-status').textContent = article.updatedAt ? `Draft saved ${new Date(article.updatedAt).toLocaleString()}` : `Loaded from ${article.source || 'local draft'}`;
  renderList();
  refreshPreview();
}

function mayLeave() {
  return !dirty || window.confirm('Discard the unsaved changes in this editor? Your last saved draft will remain on this laptop.');
}

async function openArticle(item) {
  if (!mayLeave()) return;
  const article = await api(`/api/article?type=${encodeURIComponent(item.type)}&slug=${encodeURIComponent(item.slug)}`);
  populateEditor(article);
  notice('');
}

async function saveCurrent() {
  draft = await api('/api/draft', readEditor());
  setDirty(false);
  await refreshList();
}

function startNew() {
  if (!mayLeave()) return;
  $('new-form').reset();
  $('new-slug').dataset.manual = '';
  $('new-dialog').showModal();
  $('new-title').focus();
}

function insertText(before, after = '', placeholder = '') {
  const editor = $('content');
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selection = editor.value.slice(start, end) || placeholder;
  editor.setRangeText(before + selection + after, start, end, 'end');
  editor.focus();
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

async function loadHistory() {
  const receipts = await api('/api/publications');
  if (!receipts.length) return;
  const list = $('publication-list');
  list.replaceChildren();
  for (const receipt of receipts) {
    const item = document.createElement('div');
    item.className = 'publication-item';
    const link = document.createElement('a');
    link.textContent = receipt.title;
    link.href = receipt.commitUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const state = document.createElement('small');
    state.textContent = `Saved to GitHub · ${new Date(receipt.publishedAt).toLocaleDateString()}`;
    const check = document.createElement('button');
    check.className = 'text-button';
    check.textContent = 'Check Vercel';
    check.addEventListener('click', () => action(check, async () => {
      const result = await api(`/api/deployment?sha=${receipt.sha}`);
      state.textContent = { ready: 'Vercel deployment succeeded', failed: 'Vercel deployment failed — content is saved in GitHub', building: 'Vercel is building', unknown: 'Vercel status unavailable — check deployment' }[result.state];
      if (result.url && /^https:\/\//.test(result.url)) link.href = result.url;
      else link.href = receipt.checksUrl;
    }));
    item.append(link, state, check);
    list.append(item);
  }
}

$('new-article').addEventListener('click', startNew);
$('welcome-new').addEventListener('click', startNew);
$('cancel-new').addEventListener('click', () => $('new-dialog').close());
$('new-slug').addEventListener('input', () => { $('new-slug').dataset.manual = 'true'; });
$('new-title').addEventListener('input', () => {
  if (!$('new-slug').dataset.manual) $('new-slug').value = $('new-title').value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120);
});
$('new-form').addEventListener('submit', event => {
  event.preventDefault();
  action(event.submitter, async () => {
    const type = $('new-type').value;
    const slug = $('new-slug').value;
    if (articles.some(item => item.type === type && item.slug === slug)) throw new Error('That article already exists. Choose a different slug or open it from the library.');
    const date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const article = await api('/api/draft', { type, slug, baseSha: null, metadata: { title: $('new-title').value, date }, content: '' });
    $('new-dialog').close();
    await refreshList();
    populateEditor(article);
    notice('Draft created on this laptop. Nothing has been published.');
    $('content').focus();
  });
});
$('search').addEventListener('input', renderList);
$('collection-filter').addEventListener('change', renderList);
$('connect').addEventListener('click', event => action(event.currentTarget, async () => {
  notice('Connecting to GitHub…');
  const result = await api('/api/connect', {});
  articles = result.articles;
  session.connected = true;
  $('connect').textContent = 'Refresh GitHub';
  renderList();
  notice(`Connected to ${session.repository} · main. Saved drafts are preserved; reopen an article to load its current version.`);
}));
$('save').addEventListener('click', event => action(event.currentTarget, async () => { await saveCurrent(); notice('Draft saved on this laptop.'); }));
$('load-main').addEventListener('click', event => action(event.currentTarget, async () => {
  if (!window.confirm('Replace the editor with the current version on main? Your saved local draft remains until you save again.')) return;
  const result = await api(`/api/article?type=${encodeURIComponent(draft.type)}&slug=${encodeURIComponent(draft.slug)}&source=github`);
  populateEditor(result);
  setDirty(true);
  notice('Loaded the latest article from main. Save it to replace your previous local draft.');
}));
$('editor').addEventListener('input', () => {
  if (!draft) return;
  setDirty(true);
  clearTimeout(previewTimer);
  previewTimer = setTimeout(refreshPreview, 600);
});
$('refresh-preview').addEventListener('click', refreshPreview);
document.querySelectorAll('[data-format]').forEach(button => button.addEventListener('click', () => {
  const format = button.dataset.format;
  if (format === 'heading') insertText('\n## ', '\n', 'Heading');
  if (format === 'bold') insertText('**', '**', 'bold text');
  if (format === 'italic') insertText('*', '*', 'italic text');
  if (format === 'link') insertText('[', '](https://example.com)', 'link text');
}));
$('upload').addEventListener('click', () => $('image-file').click());
$('image-file').addEventListener('change', () => action($('upload'), async () => {
  const file = $('image-file').files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) throw new Error('Choose an image under 5 MB.');
  const dataURL = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.readAsDataURL(file);
  });
  const result = await api('/api/upload', { base64: dataURL.split(',')[1] });
  insertText('\n![', `](${result.url})\n`, 'Describe this image');
  $('image-file').value = '';
  notice('Image added locally. Replace “Describe this image” with useful alternative text. It will upload to GitHub with the article.');
}));
$('review').addEventListener('click', event => action(event.currentTarget, async () => {
  notice('Checking the article and preparing a content-only publication…');
  const result = await api('/api/review', readEditor());
  activeReview = result;
  setDirty(false);
  $('review-target').textContent = `${result.repository} → ${result.target}`;
  $('review-files').replaceChildren();
  for (const file of result.files) {
    const row = document.createElement('div');
    row.className = 'review-file';
    const name = document.createElement('span');
    name.textContent = file.path;
    const detail = document.createElement('small');
    detail.textContent = `${file.action} · ${(file.bytes / 1024).toFixed(1)} KB`;
    row.append(name, detail);
    $('review-files').append(row);
  }
  $('review-before').textContent = result.before || '(New article)';
  $('review-after').textContent = result.after;
  $('publish-status').textContent = '';
  $('review-dialog').showModal();
  notice('');
}));
$('cancel-review').addEventListener('click', () => { if (!isPublishing) $('review-dialog').close(); });
$('review-dialog').addEventListener('cancel', event => { if (isPublishing) event.preventDefault(); });
$('publish').addEventListener('click', event => action(event.currentTarget, async () => {
  if (!activeReview) return;
  isPublishing = true;
  $('cancel-review').disabled = true;
  $('publish-status').textContent = 'Saving the article and its images to GitHub…';
  try {
    const result = await api('/api/publish', { id: activeReview.id });
    draft.baseSha = result.articleSha;
    setDirty(false);
    $('review-dialog').close();
    notice(result.warning || 'Saved to GitHub main. Vercel will build the site. Use “Check Vercel” under Recent publications to check its progress.');
    await refreshList();
    await loadHistory();
  } catch (error) {
    $('publish-status').textContent = error.message;
    throw error;
  } finally {
    isPublishing = false;
    $('cancel-review').disabled = false;
  }
}));
window.addEventListener('beforeunload', event => { if (dirty || isPublishing) { event.preventDefault(); event.returnValue = ''; } });
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key === 's' && draft && !busyActions && !isPublishing && !$('review-dialog').open) {
    event.preventDefault();
    action($('save'), saveCurrent);
  }
});

try {
  const response = await fetch('/api/session');
  session = await response.json();
  if (!response.ok) throw new Error(session.error);
  $('branch-label').textContent = `${session.branch || 'detached HEAD'} → main`;
  if (session.branch !== 'publisher') notice('Switch to the publisher branch before publishing. Draft editing is still available.', true);
  await refreshList();
  await loadHistory();
} catch (error) { notice(error.message, true); }
