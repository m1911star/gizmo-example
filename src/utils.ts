// @ts-nocheck
import * as BABYLON from '@babylonjs/core';
import OrientationGizmo from './control';
import { NormalMaterial } from '@babylonjs/materials';

export const main = function () {
  let canvas: HTMLCanvasElement = document.getElementById(
    'renderCanvas'
  ) as HTMLCanvasElement;
  let engine = new BABYLON.Engine(canvas, true);
  let scene = addScene(engine);
  let camera = addCamera(scene, canvas);
  scene.activeCamera = camera;
  let freeCamera = new BABYLON.FreeCamera(
    'FreeCamera',
    new BABYLON.Vector3(0, 0, -10),
    scene
  );
  freeCamera.rotationQuaternion = BABYLON.Quaternion.Identity();

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  let light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;
  var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

  addBox(scene);

  const helper = createHelper(engine);
  // const h = new Helper(scene, helper);

  engine.runRenderLoop(function () {
    scene.render();
    helper.render();
    helper.activeCamera.alpha = scene.activeCamera.alpha;
  
    helper.activeCamera.beta = scene.activeCamera.beta;
  });

  window.addEventListener('resize', function () {
    engine.resize();
    updateAxisViewViewport(helper, engine.getRenderingCanvas());
  });
  return {
    engine,
    scene,
    // layer,
    helper: new OrientationGizmo(camera),
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
    100,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.wheelPrecision = 15;
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);
  return camera;
};

let addBox = function (scene: BABYLON.Scene) {
  let mat = new BABYLON.StandardMaterial('mat', scene);
  mat.diffuseColor = new BABYLON.Color3(1, 0, 0);

  let box = BABYLON.MeshBuilder.CreateBox('', {
    height: 10,
    width: 10,
    depth: 2,
  });
  box.material = mat;
  box.position = new BABYLON.Vector3(0, 0, 0);

  box.isPickable = true;
  box.actionManager = new BABYLON.ActionManager(scene);
  box.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPickTrigger,
      function (evt) {
        console.log('on pick');
        console.log(evt.source);
      }
    )
  );
  mat.alpha = 0;
  return box;
};

const createHelper = (engine) => {
  const sceneAxisView = createAxisViewScene(engine);
  return sceneAxisView;
};

function createAxisViewScene(engine) {
  const scene = new BABYLON.Scene(engine);
  scene.autoClear = false;
  scene.autoClearDepthAndStencil = true;
  scene.blockMaterialDirtyMechanism = true;

  const ambient = new BABYLON.HemisphericLight(
    'ambient',
    new BABYLON.Vector3(0, -1, 0),
    scene
  );
  ambient.diffuse = new BABYLON.Color3(1, 1, 1);
  ambient.groundColor = new BABYLON.Color3(1, 1, 1);
  ambient.intensity = 1;

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    0,
    0,
    10,
    BABYLON.Vector3.Zero(),
    scene
  );
  const canvas = engine.getRenderingCanvas();
  camera.viewport = updateViewport(70, 70, 0, 0, canvas);
  camera.radius = 3;

  const cube = BABYLON.MeshBuilder.CreateBox('viewcube', {}, scene);
  cube.material = new NormalMaterial('viewcube', scene);
  cube.material.backFaceCulling = true;
  cube.material.alpha = 0.99;
  cube.material.freeze();
  cube.doNotSyncBoundingInfo = true;
  cube.enableEdgesRendering();
  cube.edgesWidth = 2;
  cube.edgesColor = BABYLON.Color4.FromHexString('#00000090');
  cube.convertToUnIndexedMesh(); // after edgesRendering
  cube.freezeWorldMatrix();
  cube.freezeNormals();

  const axes = new BABYLON.AxesViewer(scene, 0.6);
  axes.xAxis.parent = cube;
  axes.yAxis.parent = cube;
  axes.zAxis.parent = cube;
  return scene;
}

function updateViewport(w, h, bottom, right, canvas) {
  return new BABYLON.Viewport(
    1 - (w + right) / canvas.width,
    1 - (bottom + canvas.height) / canvas.height,
    w / canvas.width,
    h / canvas.height
  );
}

function updateAxisViewViewport(sceneAxisView: BABYLON.Scene, canvas) {
  sceneAxisView.activeCamera.viewport = updateViewport(70, 70, 0, 0, canvas);
}