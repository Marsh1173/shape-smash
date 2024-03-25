import { ShapeletData } from "../shapelet/Shapelet";
import { Input } from "../../display/Input";
import { ClientShapelet } from "../shapelet/client/ClientShapelet";
import { ClientGameSystem } from "../../system/client/ClientGameSystem";
import { HasId, Id } from "../../../utils/Id";
import { ShapeletAction } from "../shapelet/ShapeletController";
import { Vector } from "@dimforge/rapier2d-compat";
import { Graphics } from "pixi.js";
import { Camera } from "../../display/Camera";

export interface ClientPlayerData {
  shapelet_data: ShapeletData;
}

export class ClientPlayer extends HasId {
  public readonly id: Id;

  private readonly mouse_sprite: Graphics;

  constructor(
    protected readonly shapelet: ClientShapelet,
    data: ClientPlayerData,
    protected readonly game_system: ClientGameSystem
  ) {
    super();
    this.id = data.shapelet_data.id;

    this.mouse_sprite = new Graphics();
    this.mouse_sprite.beginFill(0x00ff00);
    this.mouse_sprite.drawCircle(0, 0, 10);
    this.mouse_sprite.endFill();
    this.game_system.display.layers.indicators.addChild(this.mouse_sprite);

    Input.set_listener({
      on_start_up: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveUp, true);
        this.broadcast_move(ShapeletAction.MoveUp, true);
      },
      on_end_up: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveUp, false);
        this.broadcast_move(ShapeletAction.MoveUp, false);
      },
      on_start_left: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveLeft, true);
        this.broadcast_move(ShapeletAction.MoveLeft, true);
      },
      on_end_left: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveLeft, false);
        this.broadcast_move(ShapeletAction.MoveLeft, false);
      },
      on_start_right: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveRight, true);
        this.broadcast_move(ShapeletAction.MoveRight, true);
      },
      on_end_right: () => {
        this.shapelet.controller.on_input(ShapeletAction.MoveRight, false);
        this.broadcast_move(ShapeletAction.MoveRight, false);
      },
      on_start_primary_action: (screen_pos: Vector) => {
        // const world_pos = this.game_system.camera.get_world_pos_from_screen_pos(screen_pos);
        // console.log(world_pos);
        // const pixi_pos = Camera.units_to_px(world_pos);
        // console.log(pixi_pos);
        // this.mouse_sprite.setTransform(world_pos.x, world_pos.y);
      },
      on_end_primary_action: (screen_pos: Vector) => {
        // const world_pos = this.game_system.camera.get_world_pos_from_screen_pos(screen_pos);
        // console.log(world_pos);
      },
      on_mouse_move: (screen_pos: Vector) => {
        const world_pos = this.game_system.display.camera.get_world_pos_from_screen_pos(screen_pos);
        // console.log(world_pos);

        const pixi_pos = Camera.units_to_px(world_pos);
        // console.log(pixi_pos);
        this.mouse_sprite.setTransform(pixi_pos.x, pixi_pos.y);
      },
    });
  }

  public update(elapsed_seconds: number) {
    this.shapelet.update(elapsed_seconds);
  }

  public destroy() {
    Input.clear_listener();
    this.shapelet.destroy();
  }

  public get_shapelet(): ClientShapelet {
    return this.shapelet;
  }

  protected broadcast_move(action: ShapeletAction, active: boolean) {
    this.game_system.server_talker.send({
      type: "ClientGameMessage",
      msg: {
        type: "PlayerMoveMessage",
        active,
        action,
        pos: this.shapelet.body.pos,
        vel: this.shapelet.body.velocity,
      },
    });
  }
}
