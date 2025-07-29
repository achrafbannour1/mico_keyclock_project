import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  private brand: string = '';

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private requestId!: number;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.brand = this.route.snapshot.paramMap.get('brand') || 'default';
    console.log('Brand from route:', this.brand);
  }

  ngAfterViewInit() {
    this.initThree();
    this.loadModel();
    this.setupResizeListener();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.requestId);
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();
  }

  private initThree() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createControls();
    this.animate();
  }

  private createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd4d4d8);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  private loadModel() {
    const modelPath = this.getModelPath(this.brand);
    console.log('Loading model from:', modelPath);
    new GLTFLoader().load(modelPath, (gltf) => {
      this.scene.add(gltf.scene);
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);
    }, undefined, (error) => {
      console.error(`Error loading GLTF model for ${this.brand}:`, error);
    });
  }

  private getModelPath(brand: string): string {
    const brandMap: { [key: string]: string } = {
      'Backhoe Loader': 'assets/Backhoe/scene.gltf',
      'bobcat': 'assets/bobcat/scene.gltf',
      'Dozer': 'assets/Dozer/scene.gltf',
      'tower': 'assets/tower/scene.gltf',
      'Excavator': 'assets/excavator/scene.gltf',
      'cement truck': 'assets/truck/scene.gltf'
    };
    return brandMap[brand] || 'assets/default/scene.gltf';
  }

  private createCamera() {
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(2, 2, 2);
  }

  private createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  private createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }

  private onWindowResize = () => {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  private setupResizeListener() {
    window.addEventListener('resize', this.onWindowResize);
  }

  private animate() {
    this.requestId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  goBack() {
    this.router.navigate(['/admin/resource']);
  }
}
