------------------
---- MONITORS ----
------------------

hl.monitor({
    output   = "DP-1",
    mode     = "1920x1080@180",
    position = "0x0",
    scale    = "1",
    vrr = 3,
    supports_hdr = -1
})

hl.monitor({
    output   = "HDMI-A-1",
    mode     = "1920x1080@75",
    position = "-1920x0",
    scale    = "1",
    vrr = 0,
    supports_hdr = -1
})

---------------------
---- MY PROGRAMS ----
---------------------

local terminal    = "kitty"
local fileManager = "nautilus"

-------------------
---- AUTOSTART ----
-------------------

hl.on("hyprland.start", function ()
    hl.exec_cmd("xrandr --output DP-1 --primary")
    hl.exec_cmd("noctalia")
end)

-------------------------------
---- ENVIRONMENT VARIABLES ----
-------------------------------

hl.env("GTK_THEME", "adw-gtk3-dark")
hl.env("XCURSOR_THEME","macOS-White")
hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_THEME","macOS-White")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("QT_QPA_PLATFORMTHEME", "qt6ct")

hl.env("NVD_BACKEND", "direct")
hl.env("GBM_BACKEND", "nvidia-drm")
hl.env("__GLX_VENDOR_LIBRARY_NAME", "nvidia")
hl.env("LIBVA_DRIVER_NAME", "nvidia")
hl.env("CUDA_DISABLE_PERF_BOOST", "1")

hl.env("ELECTRON_OZONE_PLATFORM_HINT", "wayland")

hl.env("HOST_LC_ALL", "uk_UA.UTF-8")
hl.env("PROTON_DXVK_LOWLATENCY", "1")
hl.env("DXVK_FRAME_PACE", "min-latency")
hl.env("PROTON_DLSS_UPGRADE", "1")
hl.env("DXVK_NVAPI_DRS_SETTINGS", "NGX_DLSS_SR_OVERRIDE_RENDER_PRESET_SELECTION=J")

hl.env("GDK_BACKEND", "wayland,x11,*")
hl.env("QT_QPA_PLATFORM", "wayland;xcb")
hl.env("SDL_VIDEODRIVER", "wayland")
hl.env("SDL_VIDEO_DRIVER", "wayland")
hl.env("CLUTTER_BACKEND", "wayland")

hl.env("XDG_CURRENT_DESKTOP", "Hyprland")
hl.env("XDG_SESSION_TYPE", "wayland")
hl.env("XDG_SESSION_DESKTOP", "Hyprland")

-----------------------
---- LOOK AND FEEL ----
-----------------------

hl.config({
    general = {
        gaps_in = 3,
        gaps_out = 5,
        border_size = 0,
        resize_on_border = true,
        allow_tearing = true,
        layout = "dwindle"
    },
    decoration = {
        rounding = 15,
        blur = {
            enabled = false
        }
    },
    dwindle = {
        preserve_split = true
    },
    input = {
        kb_layout = "us,ua,ru",
        kb_options = "grp:alt_shift_toggle",
        follow_mouse = 1,
        force_no_accel = true,
        sensitivity = 0,
        accel_profile = "flat",
        emulate_discrete_scroll = 0
    },
    cursor = {
        default_monitor = "DP-1",
        no_hardware_cursors = 0,
        use_cpu_buffer = 0
    },
    render = {
        direct_scanout = 2
    },
    misc = {
        disable_splash_rendering = true,
        force_default_wallpaper = 0,
        disable_hyprland_logo = true
    },
    ecosystem = {
        no_update_news = true,
        no_donation_nag = true
    }
})

---------------------
---- KEYBINDINGS ----
---------------------

local mainMod = "SUPER"
local ipc = "noctalia msg "

hl.bind(mainMod .. "+Space", hl.dsp.exec_cmd(ipc .. "panel-toggle launcher"))
hl.bind("ALT + Tab", hl.dsp.exec_cmd(ipc .. "window-switcher"))
hl.bind(mainMod .. "+ SHIFT + S", hl.dsp.exec_cmd(ipc .. "screenshot-region"))

hl.bind(mainMod .. " + F", hl.dsp.window.fullscreen({ mode = 0 }))
hl.bind(mainMod .. " + D", hl.dsp.window.fullscreen({ mode = 1 }))
hl.bind(mainMod .. " + Q", hl.dsp.exec_cmd(terminal))
hl.bind(mainMod .. " + C", hl.dsp.window.close())
hl.bind(mainMod .. " + M", hl.dsp.exec_cmd("command -v hyprshutdown >/dev/null 2>&1 && hyprshutdown || hyprctl dispatch 'hl.dsp.exit()'"))
hl.bind(mainMod .. " + E", hl.dsp.exec_cmd(fileManager))
hl.bind(mainMod .. " + V", hl.dsp.window.float({ action = "toggle" }))

hl.bind(mainMod .. " + left", hl.dsp.focus({ direction = "left" }))
hl.bind(mainMod .. " + right", hl.dsp.focus({ direction = "right" }))

hl.bind(mainMod .. " + up", hl.dsp.focus({ direction = "up" }))
hl.bind(mainMod .. " + down", hl.dsp.focus({ direction = "down" }))

for i = 1, 10 do
    local key = i % 10
    hl.bind(mainMod .. " + " .. key, hl.dsp.focus({ workspace = i}))
    hl.bind(mainMod .. " + SHIFT + " .. key, hl.dsp.window.move({ workspace = i }))
end

hl.bind(mainMod .. " + mouse_down", hl.dsp.focus({ workspace = "e+1" }))
hl.bind(mainMod .. " + mouse_up", hl.dsp.focus({ workspace = "e-1" }))
hl.bind(mainMod .. " + mouse:272", hl.dsp.window.drag(), { mouse = true })
hl.bind(mainMod .. " + mouse:273", hl.dsp.window.resize(), { mouse = true })

--------------------------------
---- WINDOWS AND WORKSPACES ----
--------------------------------

hl.workspace_rule({ workspace = "1", monitor = "DP-1", persistent = true })
hl.workspace_rule({ workspace = "2", monitor = "HDMI-A-1", persistent = true })
hl.workspace_rule({ workspace = "3", monitor = "DP-1" })

hl.window_rule({
    match = { class = "org.telegram.desktop" },
    no_screen_share = true
})


hl.window_rule({
    match = { class = "^steam_app_.*|^cs2|^Minecraft.*" },
    workspace = 3,
    content = "game",
    immediate = true,
    float = false,
    fullscreen = true
})

hl.window_rule({
    match = { class = "dev.noctalia.Noctalia" },
    float = true,
    size = { 1080, 920 }
})

hl.window_rule({
    match = {
        title = "^$",
        xwayland = true,
        float = true,
        fullscreen = false,
        pin = false
    },
    no_focus = true
})

hl.window_rule({
    match = { class = ".*" },
    suppress_event = "maximize"
})

require("noctalia").apply_theme()
