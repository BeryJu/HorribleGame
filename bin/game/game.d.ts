declare module MainScene {
    function create(loader: HG.Resource.ResourceLoader, done: (scene: HG.Core.Scene) => any): void;
    function createSkyBox(loader: HG.Resource.ResourceLoader, done: (e: HG.Entities.SkyBoxEntity) => any): void;
    function createPlayer(loader: HG.Resource.ResourceLoader, done: (e: HG.Entities.MeshEntity) => any): void;
}
interface GameLocale {
    debugInfo: {
        resolution: string;
        fps: string;
        verts: string;
        frametime: string;
    };
}
declare var gameCanvas: any;
declare var loader: HG.Resource.ResourceLoader;
declare var game: HG.Core.BaseGame;
declare var locale: GameLocale;
