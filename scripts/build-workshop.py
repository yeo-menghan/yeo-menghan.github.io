"""Run with Blender --background --factory-startup --python scripts/build-workshop.py."""
import bpy, math, random
from pathlib import Path
from mathutils import Vector
ROOT = Path(__file__).resolve().parents[1]
random.seed(19)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def mat(name, color, metal=0, rough=.5, emission=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metal; p.inputs['Roughness'].default_value=rough
    p.inputs['Emission Color'].default_value=(*color,1); p.inputs['Emission Strength'].default_value=emission
    return m
concrete=mat('Blue grey concrete',(.13,.20,.24)); dark=mat('Powder coated graphite',(.025,.045,.055),.65)
steel=mat('Brushed aluminium',(.32,.4,.43),.8,.3); wood=mat('Warm birch',(.43,.24,.10),0,.65)
teal=mat('Soft mint indicators',(.18,.8,.65),.2,.3,2); amber=mat('Warm task light', (1,.49,.16),0,.3,4)
white=mat('Ivory shell',(.66,.70,.65),.25,.3); rubber=mat('Rubber',(.012,.02,.027)); red=mat('Safety orange',(.9,.18,.055))
screen=mat('Terminal phosphor',(.035,.24,.22),.3,.3,.7); paper=mat('Notebook paper',(.71,.64,.45)); pcb=mat('PCB solder mask',(.035,.22,.12),.3)
def group(name, loc=(0,0,0)):
    o=bpy.data.objects.new(name,None); bpy.context.collection.objects.link(o); o.location=loc; return o
def cube(name, loc, scale, material, bevel=.04, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.name=name; o.dimensions=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        mod=o.modifiers.new('Machined edges','BEVEL'); mod.width=bevel; mod.segments=2
        bpy.context.view_layer.objects.active=o; bpy.ops.object.modifier_apply(modifier=mod.name)
    o.data.materials.append(material)
    if parent: o.parent=parent
    return o
def cyl(name,loc,r,depth,material,parent=None,vertices=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc); o=bpy.context.object; o.name=name; o.data.materials.append(material)
    if parent:o.parent=parent
    return o
def line(name, points, material, radius=.015, parent=None):
    c=bpy.data.curves.new(name,'CURVE'); c.dimensions='3D'; c.bevel_depth=radius; c.bevel_resolution=2
    s=c.splines.new('POLY'); s.points.add(len(points)-1)
    for p,co in zip(s.points,points):p.co=(*co,1)
    o=bpy.data.objects.new(name,c); bpy.context.collection.objects.link(o); o.data.materials.append(material)
    if parent:o.parent=parent
    return o
def text(body,loc,size,material,rotation=(math.pi/2,0,0),parent=None):
    bpy.ops.object.text_add(location=loc,rotation=rotation); o=bpy.context.object; o.name='Lettering '+body; o.data.body=body; o.data.size=size; o.data.extrude=.001; o.data.materials.append(material)
    if parent:o.parent=parent
    return o
cube('Floating rooftop foundation',(0,0,-.27),(10,7,.5),dark,.12)
for x in range(10):
    for y in range(7):cube('Concrete paver',(x-4.5,y-3,.015),(.98,.98,.08),concrete,.015)
for x in [-4.85,4.85]:
    cube('Parapet',(x,0,.32),(.18,7,.5),concrete)
    for y in [-3,-1,1,3]:cube('Railing upright',(x,y,.85),(.055,.055,1),steel,.01)
    for z in [.7,1.3]:line('Safety rail',[(x,-3.4,z),(x,3.4,z)],steel,.025)
cube('Rear parapet',(0,3.4,.4),(10,.18,.7),concrete)
# An open steel canopy, slatted rear wall and practical lighting.
for x in [-4.25,.7]:
    for y in [1,3]:cube('Canopy column',(x,y,1.65),(.13,.13,3.2),dark)
cube('Canopy roof',(-1.8,2,3.35),(5.5,2.6,.16),dark)
for x in range(20):cube('Rear wall slat',(-4.1+x*.25,3.08,1.9),(.13,.08,2.6),wood,.015)
cube('Task diffuser',(-1.8,1.1,3.20),(4.5,.07,.06),amber,.01)
bench=group('bench'); cube('Workbench top',(-1.9,2,1.18),(4.5,1.25,.16),wood,parent=bench)
for x in [-3.9,.1]:
    for y in [1.55,2.45]:cube('Bench leg',(x,y,.6),(.09,.09,1.1),dark,parent=bench)
cube('Tool drawer',(-3.4,2,.85),(.9,1,.45),dark,parent=bench)
for z in [.72,.88,1.02]:cube('Drawer handle',(-3.4,1.48,z),(.45,.035,.025),steel,parent=bench)
monitor=group('monitor'); cube('Monitor housing',(-1.9,2.25,1.94),(1.42,.14,.87),dark,parent=monitor)
cube('Monitor glass',(-1.9,2.168,1.94),(1.28,.02,.72),screen,.015,monitor)
cube('Monitor stem',(-1.9,2.25,1.44),(.09,.1,.4),steel,parent=monitor); cube('Monitor foot',(-1.9,2.2,1.29),(.6,.4,.04),dark,parent=monitor)
text('> vision / systems',(-2.46,2.148,2.12),.09,teal,parent=monitor)
for i in range(6):cube('Terminal line',(-2.2+random.random()*.15,2.145,1.98-i*.075),(.3+random.random()*.5,.006,.012),teal,.001,monitor)
cube('Keyboard',(-1.9,1.6,1.29),(1,.31,.055),dark,parent=bench)
for i in range(12):
    for j in range(3):cube('Key',(-2.34+i*.077,1.5+j*.08,1.325),(.05,.05,.012),steel,.003,bench)
edge=group('edge'); cube('Edge computer',(-.3,2,1.42),(.5,.65,.38),steel,parent=edge)
for x in range(7):cube('Cooling fin',(-.54+x*.08,2,1.64),(.025,.6,.09),dark,.005,edge)
for y in [1.84,1.96,2.08]:cube('IO port',(-.56,y,1.44),(.015,.07,.045),rubber,.005,edge)
cube('Power LED',(-.3,1.668,1.43),(.05,.012,.025),teal,.005,edge)
cube('Circuit board',(-3.1,1.7,1.3),(.65,.45,.035),pcb,parent=bench)
for i in range(5):cube('Board component',(-3.32+i*.11,1.7,1.35),(.065,.13,.06),dark,.005,bench)
line('Loose signal wire',[(-3.2,1.7,1.4),(-3.4,1.3,1.32),(-2.9,1.3,1.32),(-2.8,1.7,1.35)],red,parent=bench)
cube('Solder station',(-3.75,2.15,1.4),(.43,.4,.3),dark,parent=bench)
line('Soldering cable',[(-3.7,2.1,1.5),(-3.5,1.8,1.28),(-3.8,1.5,1.28),(-3.5,1.5,1.3)],rubber,.02,bench)
for i in range(4):cube('Hanging tool',(-3.7+i*.3,3,2.1),(.045,.04,.45),steel,parent=bench)
cyl('Coffee mug',(-.85,1.7,1.43),.11,.27,white,bench)
cyl('Coffee',(-.85,1.7,1.57),.09,.008,rubber,bench)
notebook=group('notebook'); cube('Notebook cover',(-2.7,-1.7,.12),(.65,.85,.08),red,parent=notebook); cube('Notebook pages',(-2.7,-1.7,.17),(.60,.8,.04),paper,parent=notebook)
for i in range(7):cube('Notebook rule',(-2.7,-1.95+i*.08,.193),(.44,.008,.002),wood,.001,notebook)
cube('Pencil',(-2.25,-1.7,.13),(.035,.7,.035),amber,parent=notebook)
# Landing pad and detailed independent quadcopter hierarchy.
cyl('Landing pad',(1.8,-.7,.12),1.65,.16,dark,vertices=64)
for r in [1.35,1.5]:line('Pad ring',[(1.8+r*math.cos(i*math.tau/64),-.7+r*math.sin(i*math.tau/64),.21) for i in range(65)],teal,.018)
text('H',(1.35,-1.18,.215),1,paper,rotation=(0,0,0))
drone=group('drone',(1.8,-.7,.6))
cube('Aerodynamic main shell',(0,0,.12),(.64,.86,.27),white,.12,drone)
cube('Battery pack',(0,.05,.31),(.42,.55,.13),dark,.05,drone)
for x in [-1,1]:
    for y in [-1,1]:
        line('Carbon arm',[(x*.2,y*.25,.08),(x*.86,y*.77,.14)],dark,.075,drone)
        cyl('Brushless motor',(x*.86,y*.77,.23),.13,.2,steel,drone)
        cyl('Motor cap',(x*.86,y*.77,.35),.09,.05,dark,drone)
        rotor=group('rotor_%s_%s'%(x,y)); rotor.parent=drone; rotor.location=(x*.86,y*.77,.39)
        blade=cube('Propeller airfoil',(0,0,0),(1.05,.10,.025),rubber,.045,rotor); blade.rotation_euler.z=x*y*.4
        cyl('Rotor hub',(0,0,.025),.055,.06,steel,rotor)
        line('Landing strut',[(x*.24,y*.3,0),(x*.42,y*.4,-.32)],steel,.025,drone)
        cyl('Navigation LED',(x*.86,y*.77,.12),.05,.025,red if x<0 else teal,drone)
for x in [-.42,.42]:line('Landing skid',[(x,-.6,-.33),(x,.6,-.33)],rubber,.035,drone)
camera=group('camera'); camera.parent=drone
cube('Gimbal yoke',(0,-.38,-.15),(.34,.08,.3),steel,parent=camera)
cube('Camera housing',(0,-.44,-.23),(.27,.24,.22),dark,.05,camera)
lens=cyl('Camera lens',(0,-.59,-.23),.09,.09,steel,camera); lens.rotation_euler.x=math.pi/2
lens=cyl('Optical glass',(0,-.64,-.23),.065,.012,screen,camera); lens.rotation_euler.x=math.pi/2
for f,loc in [(1,(1.8,-.7,.6)),(35,(1.8,-.7,1.6)),(85,(2.1,-.4,1.9)),(130,(1.4,-.9,1.7)),(180,(1.8,-.7,.6))]:
    drone.location=loc; drone.keyframe_insert(data_path='location',frame=f)
drone.animation_data.action.name='Drone_Inspect'
for o in bpy.data.objects:
    if o.name.startswith('rotor_'):
        o.rotation_euler.z=0; o.keyframe_insert(data_path='rotation_euler',frame=1)
        o.rotation_euler.z=math.tau*25; o.keyframe_insert(data_path='rotation_euler',frame=180)
        o.animation_data.action.name='Rotor_'+o.name
# Utility corner, vents, cable runs, storage and a tiny debug switch.
cube('Equipment case',(-3.7,-.9,.37),(1.2,.8,.6),dark,.1)
for x in [-4.1,-3.3]:cube('Case clasp',(x,-1.32,.4),(.12,.04,.2),steel)
cube('Vent machinery',(3.6,2.1,.8),(1.4,1.4,1.4),concrete,.1)
for i in range(9):cube('Vent louvre',(3.6,1.38,.45+i*.09),(1.1,.035,.03),dark,.005)
cyl('Exhaust',(3.6,2.1,1.7),.42,.4,steel)
line('Conduit',[(-4.4,2.7,.2),(-4.4,-2.6,.2),(-1,-2.6,.2)],dark,.04)
debug=group('debug_switch'); cube('Service box',(.5,3,1.9),(.34,.14,.5),dark,parent=debug); cube('Debug toggle',(.5,2.9,1.9),(.09,.06,.13),red,parent=debug)
text('AFTER HOURS',(-3.6,2.98,2.75),.25,paper)
text('ROBOTICS / 01',(-4.4,-3.15,.08),.22,paper,rotation=(0,0,0))
# Low-poly skyline with deliberately sparse warm windows.
city=mat('Distant blue architecture',(.035,.065,.11),.1)
window=mat('Distant warm windows',(.48,.30,.13),0,.5,.7)
for i in range(19):
    x=-13+i*1.45; y=7+random.random()*4; h=random.uniform(2.4,7)
    cube('City tower',(x,y,h/2-1),(1.1,1.2,h),city,.025)
    for z in range(int(h*2)-1):
        for dx in [-.3,0,.3]:
            if random.random()>.58:cube('City window',(x+dx,y-.608,z*.45-.3),(.12,.01,.22),window,.002)
    if i%3==0:line('Antenna',[(x,y,h-1),(x,y,h+.6)],steel,.018)
def area(name,loc,power,color,size,target):
    bpy.ops.object.light_add(type='AREA',location=loc); o=bpy.context.object; o.name=name; o.data.energy=power; o.data.color=color; o.data.shape='DISK'; o.data.size=size; o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
area('Moon softbox',(2,-1,10),1800,(.42,.65,1),8,(0,0,0))
area('Workbench practical',(-2,1,3.1),380,(1,.55,.25),3,(-2,2,1))
area('Front fill',(1,-7,5),700,(.36,.65,.7),7,(0,0,1))
bpy.ops.object.camera_add(location=(12,-17,12)); cam=bpy.context.object; cam.name='WorkshopCamera'; cam.rotation_euler=(Vector((0,1,1.1))-cam.location).to_track_quat('-Z','Y').to_euler(); cam.data.type='ORTHO'; cam.data.ortho_scale=14
scene=bpy.context.scene; scene.camera=cam; scene.world.use_nodes=True
scene.world.node_tree.nodes.get('Background').inputs[0].default_value=(.018,.032,.055,1)
scene.world.node_tree.nodes.get('Background').inputs[1].default_value=.35
scene.render.engine='CYCLES'; scene.cycles.samples=32
scene.render.resolution_x=1600; scene.render.resolution_y=1000; scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'; scene.render.image_settings.file_format='WEBP'; scene.render.image_settings.quality=88
scene.frame_end=180; scene.render.fps=30; scene.frame_set(1)
# Convert lettering and cables explicitly, then batch by parent and material.
# Interactive parents and rotor pivots remain independent, with few draw calls.
for o in list(bpy.data.objects):
    if o.type in {'FONT','CURVE'}:
        bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active=o; bpy.ops.object.convert(target='MESH')
batches={}
for o in list(bpy.data.objects):
    if o.type=='MESH': batches.setdefault((o.parent, o.data.materials[0].name if o.data.materials else ''),[]).append(o)
for (parent,material),objects in batches.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in objects:o.select_set(True)
    bpy.context.view_layer.objects.active=objects[0]; bpy.ops.object.join(); objects[0].name=(parent.name if parent else 'architecture')+'_'+material
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/workshop/workshop.blend'))
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/workshop.glb'),export_format='GLB',export_animations=True,export_lights=False,export_cameras=True)
scene.render.filepath=str(ROOT/'public/images/workshop-poster.webp'); bpy.ops.render.render(write_still=True)
scene.render.resolution_x=900; scene.render.resolution_y=1050; cam.data.ortho_scale=15
scene.render.filepath=str(ROOT/'public/images/workshop-poster-mobile.webp'); bpy.ops.render.render(write_still=True)
