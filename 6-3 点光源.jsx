import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'
import {HeartCurve} from 'three/examples/jsm/curves/CurveExtras';

const Page = () => {
  useEffect(() => {
    const $ = {
      cameraIndex:0,
      createScene() {
        const canvas = document.getElementById('c');
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        this.canvas = canvas;
        this.width = width;
        this.height = height;

        // 创建3D场景对象
        const scene = new THREE.Scene();
        this.scene = scene;
      },
      createLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff,0.95)
        this.ambientLight = ambientLight

        // 添加方向光
        const dirLight = new THREE.DirectionalLight(0xffffaa,0.95)
        const dirHelper = new THREE.DirectionalLightHelper(dirLight,3)

        dirLight.vislible = false
        dirLight.position.set(0,3,1.5)
        dirLight.castShadow = true // 让方向光产生阴影
        this.dirLight = dirLight
        this.dirHelper = dirHelper

        // 添加点光源
        const pointLight1 = new THREE.PointLight(0xf3ae3d,0.8)
        const pointLight2 = new THREE.PointLight(0xa1fc8f,0.8)


        pointLight1.castShadow = true
        pointLight2.castShadow = true
        pointLight1.position.set(-1,1,2)
        pointLight2.position.set(1,1,2)
        this.pointLight1 = pointLight1
        this.pointLight2 = pointLight2

        const sphere1 = new THREE.Points(
          new THREE.SphereGeometry(0.1,64,64),
          new THREE.MeshBasicMaterial({
            color:0xf3ae3d
          })
        )
        const sphere2 = new THREE.Points(
          new THREE.SphereGeometry(0.1,64,64),
          new THREE.MeshBasicMaterial({
            color:0xa1fc8f
          })
        )
        sphere1.position.copy(pointLight1.position)
        sphere2.position.copy(pointLight2.position)
        this.sphere1 = sphere1
        this.sphere2 = sphere2

        this.scene.add(ambientLight,dirLight,dirHelper,pointLight1,pointLight2,sphere1,sphere2) 
      },
      createObjects() {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(1,1,1),
          new THREE.MeshLambertMaterial({
            color:0x1890ff
          })
        )
        const geometry = new THREE.PlaneGeometry(10,10)
        const material = new THREE.MeshLambertMaterial({
          side:THREE.DoubleSide
        })
        const floor = new THREE.Mesh(geometry,material)
        const wall = new THREE.Mesh(geometry,material)

        box.castShadow = true // 产生阴影
        floor.receiveShadow = true // 接收阴影
        floor.rotation.x = Math.PI/2
        floor.position.y = -1
        wall.position.y = 4
        wall.position.z = -5
        wall.receiveShadow = true // 接收阴影


        this.box =box
        this.dirLight.target = box
        this.scene.add(box,floor,wall)
        this.box = box
      },
      createCamera() {
        // 创建相机对象
        const pCamera = new THREE.PerspectiveCamera(75,this.width/this.height,1,10)
        pCamera.position.set(0,0,3) //
        pCamera.up.set(0,-1,0) //
        pCamera.lookAt(this.scene.position) //
        this.scene.add(pCamera)
        this.pCamera = pCamera;
        // this.camera = pCamera

        // 创建相机对象
        const watcherCamera = new THREE.PerspectiveCamera(
          75,this.width/this.height,0.1,1000
        )
        watcherCamera.position.set(2,2,6)
        watcherCamera.lookAt(this.scene.position)
        this.watcherCamera = watcherCamera
        this.scene.add(watcherCamera)
        this.camera = watcherCamera;
      },
      datGui(){
        const gui = new dat.GUI();

        const ambientFolder = gui.addFolder('环境光')
        ambientFolder.add(this.ambientLight,'intensity',0,1,0.1).name('环境光强度')
        ambientFolder.add(this.ambientLight,'visible').name('环境光可见性')
        ambientFolder.addColor({color:0xffffff},'color').onChange(val=>{
          this.ambientLight.color = new THREE.Color(val)
        })
        ambientFolder.open()
        const dirLightFolder = gui.addFolder('方向光')
        dirLightFolder.add(this.dirLight,'intensity',0,1,0.1)
        dirLightFolder.add(this.dirLight,'visible')
        dirLightFolder.add(this.dirLight.position,'x',-20,20,0.1)
        dirLightFolder.add(this.dirLight.position,'y',-20,20,0.1)
        dirLightFolder.add(this.dirLight.position,'z',-20,20,0.1)

        dirLightFolder.open()
        

        const shadowMapFolder = gui.addFolder('阴影')
        console.log(this.dirLight.shadow)
        shadowMapFolder.add(this.dirLight.shadow.mapSize,'x',[512,1024,2048,4096])
        shadowMapFolder.add(this.dirLight.shadow.mapSize,'y',[512,1024,2048,4096])
        shadowMapFolder.add(this.dirLight.shadow,'radius',0,30,1)
        shadowMapFolder.open()




        const boxFolder = gui.addFolder('box')
        boxFolder.add(this.box.position,'x',-20,20,0.1).onChange(val=>{
          this.dirHelper.update()
        })
        boxFolder.add(this.box.position,'y',-20,20,0.1).onChange(val=>{
          this.dirHelper.update()
        })
        boxFolder.add(this.box.position,'z',-20,20,0.1).onChange(val=>{
          this.dirHelper.update()
        })
        boxFolder.open()

        const pointsFolder = gui.addFolder('点光源')
        
        pointsFolder.add(this.pointLight1,'intensity',0,1,0.1).name('P1光照强度')
        pointsFolder.add(this.pointLight1,'distance',0,20,0.1).name('P1照射距离')
        pointsFolder.add(this.pointLight1,'decay',0,20,0.1).name('衰减量')


        pointsFolder.add(this.pointLight1.position,'x',-20,20,0.1).onChange(val=>{
          this.sphere1.position.x = val
        })
        pointsFolder.add(this.pointLight1.position,'y',-20,20,0.1).onChange(val=>{
          this.sphere1.position.y = val
        })
        pointsFolder.add(this.pointLight1.position,'z',-20,20,0.1).onChange(val=>{
          this.sphere1.position.z = val
        })

        
        pointsFolder.add(this.pointLight2,'intensity',0,1,0.1).name('P2光照强度')
        pointsFolder.add(this.pointLight2,'distance',0,20,0.1).name('P2照射距离')
        pointsFolder.add(this.pointLight2,'decay',0,20,0.1).name('衰减量')

        pointsFolder.add(this.pointLight2.position,'x',-20,20,0.1).onChange(val=>{
          this.sphere2.position.x = val
        })
        pointsFolder.add(this.pointLight2.position,'y',-20,20,0.1).onChange(val=>{
          this.sphere2.position.y = val
        })
        pointsFolder.add(this.pointLight2.position,'z',-20,20,0.1).onChange(val=>{
          this.sphere2.position.z = val
        })

        pointsFolder.open()

      },
      helpers() {
        // 创建辅助坐标系
        // 创建辅助平面
      },
      render() {
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
        });

        // 开启阴影渲染
        renderer.shadowMap.enabled = true

        // 设置渲染器屏幕像素比
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        // 设置渲染器大小
        renderer.setSize(this.width, this.height);
        // 执行渲染
        renderer.render(this.scene, this.camera);
        this.renderer = renderer;
      },
      controls() {
        // 创建轨道控制器
        const orbitControls = new OrbitControls(this.camera, this.canvas);
        orbitControls.enableDamping = true;
        this.orbitControls = orbitControls;
      },
      clock: new THREE.Clock(),
      tick() {
        const elapsedTime = this.clock.getElapsedTime()
        this.pointLight1.position.x = Math.sin(elapsedTime);
        this.pointLight1.position.z = Math.cos(elapsedTime);
        this.sphere1.position.copy(this.pointLight1.position)


        // this.mesh.rotation.y += 0.01;
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.tick());
      },
      fitView() {
        window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });
      },
      init(){
        this.createScene()
        this.createLights()
        this.createObjects()
        this.createCamera()
        this.helpers()
        this.render()
        this.controls()
        this.tick()
        this.fitView()
        this.datGui()
      }
    };
    $.init()
  }, []);


  return (
    <>
      <canvas id="c" />;
    </>
  );
};

export default Page;
