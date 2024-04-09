import { Container, Sprite } from "pixi.js";
import { ClientGameSystem } from "../../system/client/ClientGameSystem";
import { ParticleUnit } from "../ParticleSystem";
import {
  ShapeletBodyColor,
  ShapeletSpriteDataGenerator,
} from "../../objects/shapelet/client/sprite/ShapeletSpriteData";
import { ImageAssetHandler } from "../../display/assets/Assets";
import RAPIER, { Collider, RigidBody, Vector } from "@dimforge/rapier2d-compat";
import { Camera } from "../../display/Camera";

interface Remain {
  life: number;
  sprite: Sprite;
  rigid_body: RigidBody;
  collider: Collider;
}

export class ShapeletRemains implements ParticleUnit {
  protected readonly remains_initial_count: number = 20;
  protected readonly scale: number = 0.2;

  protected readonly remains: Remain[] = [];
  protected readonly container: Container = new Container();

  constructor(protected readonly game_system: ClientGameSystem, color: ShapeletBodyColor, pos: Vector, x_vel: number) {
    this.game_system.display.layers.shapelets.addChild(this.container);

    const asset = ShapeletSpriteDataGenerator.get_body_asset("square", color);

    for (let i: number = 0; i < this.remains_initial_count; i++) {
      const scale_multiplier = Math.random() * 0.6 + 0.7;
      const sprite = Sprite.from(ImageAssetHandler.get(asset));
      sprite.scale.set(Camera.sprite_scale * this.scale * scale_multiplier);
      sprite.anchor.set(0.5, 0.5);
      this.container.addChild(sprite);

      const relative_pos = {
        x: Math.random() - 1 / 2,
        y: Math.random() - 1 / 2,
      };

      const rigid_body_desc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(pos.x + relative_pos.x, pos.y + relative_pos.y)
        .setLinvel(relative_pos.x * 10 + x_vel / 2, relative_pos.y * 10 - 7)
        .setLinearDamping(3)
        .setAdditionalSolverIterations(1);
      const rigid_body = this.game_system.rapier_world.createRigidBody(rigid_body_desc);

      const collider_desc = RAPIER.ColliderDesc.cuboid(
        (this.scale * scale_multiplier) / 2,
        (this.scale * scale_multiplier) / 2
      )
        .setCollisionGroups(0x00040005)
        .setRestitution(0.8);
      const collider = this.game_system.rapier_world.createCollider(collider_desc, rigid_body);

      this.remains.push({
        life: Math.random() / 3 + 5,
        sprite,
        rigid_body,
        collider,
      });
    }
  }

  public update(elapsed_seconds: number): boolean {
    for (let i: number = 0; i < this.remains.length; i++) {
      const finished = this.update_remain(elapsed_seconds, this.remains[i]);
      if (finished) {
        this.destroy_remain(this.remains[i]);
        this.remains.splice(i, 1);
        i--;
      }
    }

    return this.remains.length === 0;
  }

  protected update_remain(elapsed_seconds: number, remain: Remain): boolean {
    const px_pos = Camera.units_to_px(remain.rigid_body.translation());
    remain.sprite.position.set(px_pos.x, px_pos.y);
    remain.sprite.transform.rotation = remain.collider.rotation();

    remain.life -= elapsed_seconds;
    return remain.life < 0;
  }

  protected destroy_remain(remain: Remain) {
    remain.sprite.destroy();
    this.game_system.rapier_world.removeRigidBody(remain.rigid_body);
    this.game_system.rapier_world.removeCollider(remain.collider, false);
  }

  public destroy(): void {
    this.game_system.display.layers.shapelets.removeChild(this.container);
    this.remains.forEach((remain) => {
      this.destroy_remain(remain);
    });
  }
}
