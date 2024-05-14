import { ClientObjectFactory } from "../../objects/factory/ClientObjectFactory";
import { GameSystem } from "../GameSystem";
import { ServerTalker } from "../../../../client/network/ServerTalker";
import { ClientGameRouter } from "./ClientGameRouter";
import { GameDisplay } from "../../display/GameDisplay";
import { GameInput } from "../../display/input/GameInput";
import { ClientGamePlayerState } from "./player/ClientGamePlayerState";
import { ClientObjectContainer } from "../../objects/container/ClientObjectContainer";
import { LifecycleTextures } from "../../display/pixijsutils/LifecycleTextures";
import { ClientGameData } from "../server/ServerGameMessageSchema";
import { ParticleSystem } from "../../particlesystem/ParticleSystem";
import { ClientAbilityFactory } from "../../abilities/factory/ClientAbilityFactory";
import { debug_shapes } from "../../display/DebugShapes";

export class ClientGameSystem extends GameSystem {
  public readonly ability_factory: ClientAbilityFactory;
  public readonly object_factory: ClientObjectFactory;
  public readonly object_container: ClientObjectContainer;
  public readonly particle_system: ParticleSystem;
  public readonly router: ClientGameRouter;

  public readonly display: GameDisplay;
  public readonly player_state: ClientGamePlayerState;
  public readonly game_input: GameInput;

  constructor(
    data: ClientGameData,
    canvas: HTMLCanvasElement,
    public readonly server_talker: ServerTalker
  ) {
    super(data);

    this.display = new GameDisplay(this, canvas);

    this.router = new ClientGameRouter(this);
    this.ability_factory = new ClientAbilityFactory();
    this.object_factory = new ClientObjectFactory(this);
    this.object_container = new ClientObjectContainer(this);

    this.populate_objects(data);

    this.player_state = new ClientGamePlayerState(data.player_state, this, data.user_id);
    this.game_input = new GameInput(this);
    this.particle_system = new ParticleSystem(this);
  }

  public update(elapsed_seconds: number): void {
    this.particle_system.update(elapsed_seconds);
    this.game_input.update();
    super.update(elapsed_seconds);
    this.display.update(elapsed_seconds);

    // debug_shapes(this.rapier_world, this.display.layers.indicators);
  }

  public dispose() {
    this.particle_system.destroy();
    this.game_input.cleanup();
    this.player_state.deconstruct();
    LifecycleTextures.destroy_all();
    super.dispose();
  }
}
export { ClientGameData };
