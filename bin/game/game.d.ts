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
declare var mainScene: HG.Scenes.BaseScene;
declare var locale: GameLocale;
declare var cam: any;
