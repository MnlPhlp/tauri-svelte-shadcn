#![allow(clippy::needless_pass_by_value)]

use tauri::{AppHandle, Manager};
use tauri_plugin_svelte::ManagerExt;

#[tauri::command]
#[specta::specta]
fn greet(name: &str) -> String {
    format!("Hello, {name}! You've been greeted from Rust!")
}

#[tauri::command]
#[specta::specta]
fn greet_from_store(app: AppHandle) {
    let name = app.svelte().try_get::<String>("store", "name").unwrap();
    let msg = format!("Hello, {name}! You've been greeted from Rust using the store!");
    app.svelte().set("store", "greetMsg", msg).unwrap();
}

#[allow(clippy::missing_panics_doc)]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri_specta::Builder::<tauri::Wry>::new()
        .commands(tauri_specta::collect_commands![greet, greet_from_store,]);

    #[cfg(all(debug_assertions, desktop))] // <- Only export on non-release builds
    builder
        .export(
            specta_typescript::Typescript::default(),
            "../src/lib/bindings.ts",
        )
        .expect("Failed to export typescript bindings");

    let tauri_builder = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_svelte::init());
    #[cfg(feature = "headless")]
    let http = tauri_invoke_http::Invoke::new(["*"], Some(8080));
    #[cfg(feature = "headless")]
    let tauri_builder = tauri_builder.invoke_system(http.initialization_script());

    tauri_builder
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            // This is also required if you want to use events
            builder.mount_events(app);
            #[cfg(feature = "headless")]
            http.start(app.handle());

            Ok(())
        })
        .on_window_event(|window, event| {
            // make sure the latest store value gets saved on window close
            if let tauri::WindowEvent::Destroyed = event {
                window.app_handle().svelte().save_all_now().unwrap();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
