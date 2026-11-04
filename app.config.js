// Lets the dev build install beside the release app (different package name + label).
const IS_DEV = process.env.APP_VARIANT === "development";

// Navy sampled from the artwork's own background, so icon and splash blend
const BRAND_BG = "#1D1E30";

module.exports = ({ config }) => {
    const base = {
        ...config,
        name: IS_DEV ? "Remote (Dev)" : config.name,
        android: {
        ...config.android,
        package: IS_DEV ? "com.praju_maharjan.Remote.dev" : config.android.package,
        },
    };

    // Development build keeps the default Expo icon + splash from app.json
    if (IS_DEV) return base;

    // Every other build (preview) gets the new icon + splash
    return {
        ...base,
        icon: "./assets/images/app-icon.png",
        android: {
        ...base.android,
        // Written out in full so the default background image and monochrome layer aren't inherited
        adaptiveIcon: {
            foregroundImage: "./assets/images/app-icon-foreground.png",
            backgroundColor: BRAND_BG,
        },
        },
        plugins: (base.plugins ?? []).map((plugin) =>
        Array.isArray(plugin) && plugin[0] === "expo-splash-screen"
            ? [
                "expo-splash-screen",
                {
                ...plugin[1],
                backgroundColor: BRAND_BG, // Default blue
                android: {
                    ...plugin[1].android,
                    image: "./assets/images/app-splash.png",
                    imageWidth: 288, 
                },
                },
            ]
            : plugin
        ),
    };
};