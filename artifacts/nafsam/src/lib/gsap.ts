import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Observer } from "gsap/Observer";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { CustomBounce } from "gsap/CustomBounce";
import { CustomWiggle } from "gsap/CustomWiggle";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import "gsap/EasePack";

// Every plugin the GSAP package ships with, registered once for the whole app.
// ScrollSmoother and the Pixi/Easel/Physics2D/GSDevTools/MotionPathHelper
// plugins are intentionally left out: ScrollSmoother conflicts with Lenis,
// the others need extra libraries or are dev-only tools.
gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  Flip,
  Draggable,
  InertiaPlugin,
  Observer,
  MotionPathPlugin,
  DrawSVGPlugin,
  MorphSVGPlugin,
  CustomEase,
  CustomBounce,
  CustomWiggle,
  ScrambleTextPlugin,
  TextPlugin,
);

export const archiveEase = CustomEase.create("archive", "M0,0 C0.16,1 0.3,1 1,1");
export const bounceEase = CustomBounce.create("archiveBounce", { strength: 0.5, squash: 2 });
export const starWiggle = CustomWiggle.create("starWiggle", { wiggles: 6, type: "easeOut" });

export {
  gsap,
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  Flip,
  Draggable,
  InertiaPlugin,
  Observer,
  MotionPathPlugin,
  DrawSVGPlugin,
  MorphSVGPlugin,
  CustomEase,
  CustomBounce,
  CustomWiggle,
  ScrambleTextPlugin,
  TextPlugin,
};
