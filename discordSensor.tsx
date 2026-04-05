/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import { OpenExternalIcon } from "@components/Icons";
import definePlugin, { OptionType } from "@utils/types";
import { Menu } from "@webpack/common";

const settings = definePluginSettings({
    discordSensorUrl: {
        type: OptionType.STRING,
        description: "Base URL of Discord Sensor (without trailing slash)",
        default: "https://discord-sensor.com",
        restartNeeded: false,
    },
    contextMenu: {
        type: OptionType.BOOLEAN,
        description: "Show 'View on Discord Sensor' option in context menus (right-click on users)",
        default: true,
        restartNeeded: false,
    },
    profileMenu: {
        type: OptionType.BOOLEAN,
        description: "Show 'View on Discord Sensor' option in user profiles",
        default: true,
        restartNeeded: false,
    },
});

const createMenuItem = (userId: string, baseUrl: string) => (
    <Menu.MenuItem
        id="discord-sensor"
        label="View on Discord Sensor"
        icon={OpenExternalIcon}
        action={() => window.open(`${baseUrl}/members/${userId}`, "_blank")}
    />
);

const userContextPatch: NavContextMenuPatchCallback = (children, { user }) => {
    if (!user?.id) return;
    if (!settings.store.contextMenu) return;

    children.push(createMenuItem(user.id, settings.store.discordSensorUrl));
};

const userProfilePatch: NavContextMenuPatchCallback = (children, { user }) => {
    if (!user?.id) return;
    if (!settings.store.profileMenu) return;

    children.push(createMenuItem(user.id, settings.store.discordSensorUrl));
};

export default definePlugin({
    name: "DiscordSensor",
    description: "Adds a button to view Discord users on Discord Sensor website",
    authors: [{
        name: "intimki",
        id: 1359607997063499866n,
    }],
    settings,
    contextMenus: {
        "user-context": userContextPatch,
        "user-profile-actions": userProfilePatch,
        "user-profile-overflow-menu": userProfilePatch,
    },
});