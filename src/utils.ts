// @ts-nocheck
import * as BABYLON from 'babylonjs';
import { Mesh } from 'babylonjs';
import { blurPixelShader } from 'babylonjs/Shaders/blur.fragment';
import { EditControl } from './control';
import im from './mBBxGJH.jpeg';

export const main = function () {
  let canvas: HTMLCanvasElement = <HTMLCanvasElement>(
    document.getElementById('renderCanvas')
  );
  let engine = new BABYLON.Engine(canvas, true);

  let scene = addScene(engine);
  let camera = addCamera(scene, canvas);
  // let grid = addGrid(scene);
  //   let box = addBox(scene);
  // let editControl = addEditControl(box, camera, canvas)
  var layer = new BABYLON.Layer('', im, scene, true);

  let mat = new BABYLON.StandardMaterial('mat', scene);
  mat.diffuseColor = new BABYLON.Color3(0, 0, 0);
  let box = BABYLON.MeshBuilder.CreateBox('', {
    height: 0,
    width: 0,
    depth: 0,
  });
  box.material = mat;
  box.position = new BABYLON.Vector3(0, 0, 0);
  mat.alpha = 0;
  // Create utility layer the gizmo will be rendered on
  var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

  // Create the gizmo and attach to the sphere
  var gizmo = new BABYLON.PositionGizmo(utilLayer);
  gizmo.attachedMesh = box;
  var dragobserver = new BABYLON.PointerDragBehavior();
  dragobserver.onDragObservable.add((event) => {
    console.log('drag');
    console.log(event);
  });

  // Keep the gizmo fixed to world rotation
  gizmo.updateGizmoRotationToMatchAttachedMesh = true;
  gizmo.updateGizmoPositionToMatchAttachedMesh = true;
  gizmo.onDragStartObservable.add((...args: any[]) => {
    console.log('onDragStartObservable', args);
    console.log(
      'onDragStartObservable',
      gizmo.xGizmo.dragBehavior.lastDragPosition,
      gizmo.yGizmo.dragBehavior.lastDragPosition,
      gizmo.zGizmo.dragBehavior.lastDragPosition
    );
  });
  gizmo.onDragEndObservable.add((...args: any[]) => {
    console.log('onDragEndObservable', args);
    console.log(
      'onDragStartObservable',
      gizmo.xGizmo.dragBehavior.lastDragPosition,
      gizmo.yGizmo.dragBehavior.lastDragPosition,
      gizmo.zGizmo.dragBehavior.lastDragPosition
    );
  });

  gizmo.xGizmo.dragBehavior.onDragObservable.add((...args: any[]) => {
    console.log('X: gizmo.xGizmo.dragBehavior.onDragObservable', args);
  });

  gizmo.zGizmo.dragBehavior.onDragObservable.add((...args: any[]) => {
    console.log('Z: gizmo.zGizmo.dragBehavior.onDragObservable', args);
  });

  gizmo.yGizmo.dragBehavior.onDragObservable.add((...args: any[]) => {
    console.log('Y: gizmo.yGizmo.dragBehavior.onDragObservable', args);
  });

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener('resize', function () {
    engine.resize();
  });
  return {
    engine,
    scene,
    layer,
  };
};

let addScene = function (engine: BABYLON.Engine) {
  let scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.75, 0.75, 0.75, 1);
  let light = new BABYLON.HemisphericLight(
    'light1',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.5;
  return scene;
};

let addCamera = function (scene: BABYLON.Scene, canvas: HTMLCanvasElement) {
  let camera = new BABYLON.ArcRotateCamera(
    'ArcRotateCamera',
    Math.PI / 4,
    Math.PI / 4,
    20,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.wheelPrecision = 15;
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);
  return camera;
};

let addGrid = function (scene: BABYLON.Scene) {
  let ground = BABYLON.Mesh.CreateGround('ground1', 20, 20, 10, scene);
  let gridMaterial = new BABYLON.StandardMaterial('Grid Material', scene);
  gridMaterial.wireframe = true;
  ground.material = gridMaterial;
};

let addBox = function (scene: BABYLON.Scene) {
  let mat = new BABYLON.StandardMaterial('mat', scene);
  mat.diffuseColor = new BABYLON.Color3(1, 0, 0);

  let box = BABYLON.MeshBuilder.CreateBox('', {
    height: 5,
    width: 3,
    depth: 2,
  });
  box.material = mat;

  box.position = new BABYLON.Vector3(0, 1, 0);

  mat.alpha = 0;
  return box;
};

let addEditControl = function (
  mesh: Mesh,
  camera: BABYLON.Camera,
  canvas: HTMLCanvasElement
) {
  //if we are planning on doing rotation in quaternion then make sure the rotationQuaternion is atleast initialized
  //else edit control will throw following exception
  //"Eulerian is set to false but the mesh's rotationQuaternion is not set."
  mesh.rotationQuaternion = BABYLON.Quaternion.Identity();

  //create edit control (mesh to attach to,camera, canvas, scale of editcontrol, if doing rotation in euler)
  let ec: EditControl = new EditControl(
    mesh,
    camera,
    canvas,
    0.75,
    false,
    0.02
  );

  //show translation controls
  ec.enableTranslation();

  return ec;
};

let setButtons = function (editControl: EditControl) {
  let transButton = document.getElementById('trans');
  let rotButton = document.getElementById('rotate');
  let scaleButton = document.getElementById('scale');

  transButton!.onclick = function () {
    editControl.enableTranslation();
  };
  rotButton!.onclick = function () {
    editControl.enableRotation();
  };
  scaleButton!.onclick = function () {
    editControl.enableScaling();
  };
};
