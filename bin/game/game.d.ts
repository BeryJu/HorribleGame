interface GameLocale {
    debugInfo: {
        resolution: string;
        fps: string;
        verts: string;
        frametime: string;
    };
}
declare module MainScene {
    function create(loader: HG.Resource.ResourceLoader): HG.Scenes.Scene;
    function createSkyBox(loader: HG.Resource.ResourceLoader): HG.Entities.MeshEntity;
    function createHeightMap(loader: HG.Resource.ResourceLoader): HG.Entities.MeshEntity;
}
declare var gameCanvas: any;
declare var loader: HG.Resource.ResourceLoader;
declare var game: HG.Core.BaseGame;
declare var mainScene: HG.Scenes.Scene;
declare var locale: GameLocale;
