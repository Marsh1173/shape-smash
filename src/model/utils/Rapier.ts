export type Rapier = typeof import("@dimforge/rapier2d-compat");
import RAPIER from "@dimforge/rapier2d-compat";

export const Rapier = RAPIER as Rapier;
export const RapierPromise = Rapier.init();

/*
WORLD.STEP() RESEARCH
world.timestep is the field that decides how much time passes in each step().
*/
