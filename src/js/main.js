//Bundles the CSS into the build distribution pipeline
import '../css/style.css';

//Initialize the isolated canvas particle grid logic
import { initUniverse } from './canvasUniverse';
initUniverse();

//Initialize the visual timeline sequences
import { inituiAnimations } from './uiAnimations.js';
inituiAnimations();