/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { UserAreaButton, UserAreaRenderProps } from "@api/UserArea";
import definePlugin, { OptionType } from "@utils/types";
import { FluxDispatcher } from "@webpack/common";

export let isFakeActive = false;

const settings = definePluginSettings({
    fakeMute: {
        description: "Make everyone believe you're muted (you can still speak)",
        type: OptionType.BOOLEAN,
        default: true,
    },
    fakeDeafen: {
        description: "Make everyone believe you're deafened (you can still hear)",
        type: OptionType.BOOLEAN,
        default: true,
    },
});

/**
 * Перемикає стан глушіння через FluxDispatcher Discord
 */
const toggleDeafen = () => {
    FluxDispatcher.dispatch({
        type: "AUDIO_TOGGLE_SELF_DEAF"
    });
};

const Icon = ({ enabled }: { enabled?: boolean; }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
            fill={enabled ? "var(--status-danger)" : "currentColor"}
            d="M17.93 1.51a.74.74 0 0 0-1.41 0l-1.13 3.47h-3.65a.74.74 0 0 0-.43 1.35l2.95 2.14-1.13 3.47a.74.74 0 0 0 1.14.83l2.95-2.15 2.96 2.15a.74.74 0 0 0 1.14-.83l-1.13-3.47 2.95-2.14a.74.74 0 0 0-.43-1.35h-3.65l-1.13-3.47ZM10.7 14.7a1 1 0 0 0-1.4-1.4l-8 8a1 1 0 1 0 1.4 1.4l8-8ZM9.7 8.3a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4-1.4l6-6a1 1 0 0 1 1.4 0ZM15.7 15.7a1 1 0 0 0-1.4-1.4l-6 6a1 1 0 1 0 1.4 1.4l6-6Z"
        />
    </svg>
);

const FakeVoiceOptionToggleButton = ({ hideTooltips, nameplate }: UserAreaRenderProps) => {
    if (!settings.store.fakeMute && !settings.store.fakeDeafen) return null;

    const toggleFake = () => {
        isFakeActive = !isFakeActive;
        toggleDeafen();
        toggleDeafen(); // Double click to toggle
    };

    return (
        <UserAreaButton
            tooltipText={hideTooltips ? undefined : (isFakeActive ? "Disable Fake" : "Enable Fake")}
            icon={<Icon enabled={isFakeActive} />}
            role="switch"
            aria-checked={!isFakeActive}
            redGlow={isFakeActive}
            plated={nameplate != null}
            onClick={toggleFake}
        />
    );
};

export default definePlugin({
    name: "FakeVoice",
    description: "...",
    authors: [{ name: "intimki", id: 1359607997063499866n }],
    settings,

    userAreaButton: {
        icon: Icon,
        render: FakeVoiceOptionToggleButton
    },

    patches: [{
        find: "}voiceStateUpdate(",
        replacement: {
            match: /self_mute:([^,]+),self_deaf:([^,]+)/,
            replace: "self_mute:$self.toggle($1,'fakeMute'),self_deaf:$self.toggle($2,'fakeDeafen')",
        }
    }],

    toggle(original: boolean, key: "fakeMute" | "fakeDeafen"): boolean {
        return isFakeActive ? settings.store[key] : original;
    },
});
