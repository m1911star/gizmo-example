// @ts-nocheck
import * as BABYLON from 'babylonjs';
import im from './mBBxGJH.jpeg';
import OrientationGizmo from './control';

export const main = function () {
  let canvas: HTMLCanvasElement = <HTMLCanvasElement>(
    document.getElementById('renderCanvas')
  );
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
  let transform = [
    {
      position: freeCamera.position,
      rotationQuaternion: freeCamera.rotationQuaternion,
    },
    {
      position: freeCamera.position,
      rotationQuaternion: freeCamera.rotationQuaternion,
    },
    {
      position: freeCamera.position,
      rotationQuaternion: freeCamera.rotationQuaternion,
    },
  ];

  let layer = new BABYLON.Layer('', im, scene, true);

  let box = BABYLON.MeshBuilder.CreateBox('box', {
    height: 10,
    width: 10,
    depth: 0,
  });
  box.isPickable = true;
  box.position = new BABYLON.Vector3(0, 0, 0);
  // mat.alpha = 0;
  // Create utility layer the gizmo will be rendered on
  var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

  var gizmoManager = new BABYLON.GizmoManager(scene);
  gizmoManager.positionGizmoEnabled = true;
  gizmoManager.rotationGizmoEnabled = true;
  gizmoManager.scaleGizmoEnabled = true;
  gizmoManager.boundingBoxGizmoEnabled = true;
  // gizmoManager.attachableMeshes = [box];
  gizmoManager.usePointerToAttachGizmos = true;
  gizmoManager.attachToMesh(box);

  var cameraGizmo = new BABYLON.CameraGizmo();
  cameraGizmo.camera = freeCamera;
  cameraGizmo.attachedNode.position = freeCamera.position;
  cameraGizmo.attachedNode.rotationQuaternion = freeCamera.rotationQuaternion;
  cameraGizmo.onClickedObservable.add((_camera) => {
    gizmoManager.attachToNode(_camera);
  });
  let currentSnapshotIndex = 0;
  if (gizmoManager.gizmos.positionGizmo) {
    gizmoManager.gizmos.positionGizmo.onDragEndObservable.add(() => {
      transform[currentSnapshotIndex].position = freeCamera.position.clone();
    });
  }

  if (gizmoManager.gizmos.rotationGizmo) {
    gizmoManager.gizmos.rotationGizmo.onDragEndObservable.add(() => {
      transform[currentSnapshotIndex].rotationQuaternion =
        BABYLON.Quaternion.FromRotationMatrix(
          freeCamera.getWorldMatrix()
        ).clone();
    });
  }
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
