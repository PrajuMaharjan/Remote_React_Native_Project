// verified againt samsumct1(github.com/Ape/samsumgct1) and the Home Assistant Samsung TV integration docs

export const SamsungCommands={
    POWER:"KEY_POWER",

    VOLUME_UP:"KEY_VOLUP",
    VOLUME_DOWN:"KEY_VOLDOWN",
    MUTE:"KEY_MUTE",

    CHANNEL_UP:"KEY_CHUP",
    CHANNEL_DOWN : "KEY_CHDOWN",

    UP:"KEY_UP",
    DOWN:"KEY_DOWN",
    LEFT:"KEY_LEFT",
    RIGHT:"KEY_RIGHT",
    OK:"KEY_ENTER",

    HOME:"KEY_HOME",
    BACK:"KEY_RETURN",
    MENU:"KEY_MENU",
    SOURCE:"KEY_SOURCE",

    PLAY:"KEY_PLAY",
    PAUSE:"KEY_PAUSE",
    REWIND:"KEY_REWIND",
    FAST_FORWARD:"KEY_FF",

    RED:"KEY_RED",
    GREEN:"KEY_GREEN",
    BLUE:"KEY_BLUE",
    YELLOW:"KEY_YELLOW",

} as const;

export type SamsungCommand=typeof SamsungCommands[keyof typeof SamsungCommands];