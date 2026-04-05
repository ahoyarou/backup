/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { getCustomColorString } from "@equicordplugins/customUserColors";
import definePlugin, { OptionType } from "@utils/types";
import {
    ChannelStore,
    GuildMemberStore,
    GuildRoleStore,
    GuildStore,
} from "@webpack/common";

export const settings = definePluginSettings({
    voiceUsers: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Show role colors in voice channel user list",
        restartNeeded: true
    },
    allowedRoleIds: {
        type: OptionType.STRING,
        description: "Comma-separated list of role IDs whose colors will be applied",
        default: "848876814210170910,848876812590776322,1392204324137861282,1392204275609763913,947140414564094002,947140413771378698,774059944826765334,774068798620696598,1089888911439966289,1089888531469586503,870071286615924768,870071056940027944",
        restartNeeded: false,
    },
});

function getAllowedRoleIdsSet(): Set<string> {
    const ids = settings.store.allowedRoleIds.split(",").map((id: string) => id.trim());
    return new Set(ids.filter((id: string) => id.length > 0));
}

function getAllowedRoleColor(userId: string, guildId: string | null): string | null {
    if (!guildId) return null;

    const member = GuildMemberStore.getMember(guildId, userId);
    if (!member?.roles) return null;

    const allowedRoles = getAllowedRoleIdsSet();

    for (const roleId of member.roles) {
        if (allowedRoles.has(roleId)) {
            const role = GuildRoleStore.getRole(guildId, roleId);
            return role?.colorString ?? null;
        }
    }

    return null;
}

function getColorString(userId: string, channelOrGuildId: string) {
    if (window.Vencord.Plugins.plugins.CustomUserColors?.enabled) {
        const customColor = getCustomColorString?.(userId, true);
        if (customColor) return customColor;
    }

    const guildId = ChannelStore.getChannel(channelOrGuildId)?.guild_id ?? GuildStore.getGuild(channelOrGuildId)?.id;
    if (guildId == null) return null;

    return getAllowedRoleColor(userId, guildId);
}

function getColorStyle(userId: string, channelOrGuildId: string) {
    const colorString = getColorString(userId, channelOrGuildId);
    return colorString && { color: colorString };
}

export default definePlugin({
    name: "GenderColor",
    authors: [{
        name: "intimki",
        id: 1359607997063499866n
    }],
    description: "...",
    settings,

    patches: [
        {
            find: "#{intl::GUEST_NAME_SUFFIX})]",
            replacement: [
                {
                    match: /#{intl::GUEST_NAME_SUFFIX}.{0,50}?"".{0,100}\](?=\}\))(?<=guildId:(\i),.+?user:(\i).+?)/,
                    replace: "$&,style:$self.getColorStyle($2.id,$1),"
                }
            ],
            predicate: () => settings.store.voiceUsers
        }
    ],

    getColorStyle,
    getColorString,
});
