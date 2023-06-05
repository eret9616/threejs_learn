import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'

const Page = () => {
  useEffect(() => {
    const $ = {
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
        // 添加全局光照
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

        this.directionalLight = directionalLight
        directionalLight.position.set(1,2,4)
        this.scene.add(ambientLight, directionalLight);
      },
      loadTextures(){
        // const img = new Image()
        // const texture = new THREE.Texture(img)
        // img.src = '/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg'
        // img.onload = function(){
        //   texture.needsUpdate = true
        // }


        // const textLoader = new THREE.TextureLoader()
        // this.texture = textLoader.setCrossOrigin('anonymous').load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg',
        // // onload 回调
        //   function(texture){
        //   },
        //   null,
        //   (err)=>{
        //     console.log(err);
        //   }
        // )

        const manager = new THREE.LoadingManager();
        manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
          console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };
        manager.onLoad = function ( ) {
          console.log( 'Loading complete!');
        };
        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
          console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };
        manager.onError = function ( url ) {
          console.log( 'There was an error loading ' + url );
        };
        const textureLoader = new THREE.TextureLoader(manager)

        const texture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_basecolor.jpg')
        const aoTexture = textureLoader.load('/src/assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg')
        const bumpTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_height.png')
        const normalTexture = textureLoader.load('/public/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_normal.jpg')
        const roughnessTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_roughness.jpg')
        const metalTexture = textureLoader.load('/src/assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_metallic.jpg')
        const specularTexture = textureLoader.load('/src/assets/textures/earth/earth_specular_2048.jpg')

        // 纹理回环
        texture.repeat.set(2,2)
        texture.wrapS = THREE.RepeatWrapping // 默认值 ClampToEdgeWrapping 阵列： RepeatWrapping 镜像: MirroredRepeatWrapping
        texture.wrapT = THREE.RepeatWrapping // 默认值 ClampToEdgeWrapping 阵列： RepeatWrapping 镜像: MirroredRepeatWrapping

        // 纹理偏移
        texture.offset =new THREE.Vector2(0.5,0.5)
        // 旋转
        texture.rotation = Math.PI / 12 // 正值：逆时针
        texture.center.set(0.5,0.5)


        this.aoTexture = aoTexture
        this.texture = texture
        this.bumpTexture = bumpTexture
        this.normalTexture = normalTexture
        this.roughnessTexture = roughnessTexture
        this.metalTexture = metalTexture
        this.specularTexture = specularTexture

        // 环境贴图加载器
        const cubeTextureLoader = new THREE.CubeTextureLoader()
        const envTexture = cubeTextureLoader.load([
          '/src/assets/textures/fullscreen/1.left.jpg',
          '/src/assets/textures/fullscreen/1.right.jpg',
          '/src/assets/textures/fullscreen/1.top.jpg',
          '/src/assets/textures/fullscreen/1.bottom.jpg',
          '/src/assets/textures/fullscreen/1.front.jpg',
          '/src/assets/textures/fullscreen/1.back.jpg',
        ])
        this.envTexture = envTexture
      },
      createObjects() {
        const material = new THREE.MeshNormalMaterial({
          color:0x1890ff,
          transparent: true,
          side:THREE.DoubleSide,
        })
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1),material) // 平面
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5,16,16),material) // 球体
        const box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),material) // 立方体
        const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4,0.2,16,32),material) // 圆环

        console.log(material);
        console.log(THREE.DoubleSide)
        plane.position.z = -1
        box.position.z = 1
        sphere.position.x = -1.5
        torus.position.x = 1.5

        this.material = material
        this.torus = torus
        this.sphere = sphere
        this.scene.add(plane,sphere,box,torus);
      },
      createCamera() {
        // 创建第二个相机
        const watcherCamera = new THREE.PerspectiveCamera(
          75,this.width/this.height,0.1,1000
        )
        watcherCamera.position.set(0,0,4)
        watcherCamera.lookAt(this.scene.position)
        this.scene.add(watcherCamera)
        this.camera = watcherCamera;

      },
      datGui(){
        const gui = new dat.GUI();

        gui.add(this.directionalLight.position,'x',-20,20,0.1)
        gui.add(this.directionalLight.position,'y',-20,20,0.1)
        gui.add(this.directionalLight.position,'z',-20,20,0.1)

        const meshFolder = gui.addFolder('物体')
        meshFolder.add(this.material,'wireframe')
        meshFolder.add(this.material,'flatShading').onChange(val=>{
          this.material.needUpdate = true
        })

        console.log(this.sphere.geometry);
        meshFolder.add(this.sphere.geometry.parameters,'heightSegments',16,100,1).onChange(val=>{
          this.sphere.geometry.dispose()
          const geometry = new THREE.SphereGeometry(0.5,16,val)
          this.sphere.geometry = geometry
        })
        meshFolder.open()

      },
      helpers() {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        // 创建辅助平面
        this.scene.add(axesHelper);
      },
      render() {
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
        });
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
      tick() {
        this.orbitControls.update();
        // this.texture.offset.x+=0.01
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
        this.loadTextures()
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
