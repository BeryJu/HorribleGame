declare module MainScene {
    var WORLD_SIZE: number;
    function create(game: HG.Core.BaseGame, loader: HG.Resource.Loader): HG.Resource.SceneLoader;
    function createSkyBox(loader: HG.Resource.Loader, done: (e: HG.Entities.SkyBoxEntity) => any): void;
    function createHeightMap(loader: HG.Resource.Loader, done: (e: HG.Entities.MeshEntity) => any): void;
    function createMap(loader: HG.Resource.Loader, done: (e: HG.Entities.MeshEntity) => any): void;
    function createExplosion(loader: HG.Resource.Loader, done: (e: HG.Entities.MeshEntity) => any): void;
    function createPlayer(loader: HG.Resource.Loader, done: (e: HG.Entities.MeshEntity) => any): void;
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
declare var loader: HG.Resource.Loader;
declare var game: HG.Core.BaseGame;
declare var locale: GameLocale;
