<?php

class WP_Todo_App {
    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);


        $this->register_classes();
    }

    public function add_admin_menu() {
        add_menu_page(
            'Todo App',
            'Todo App',
            'manage_options',
            'wp-todo-app',
            [$this, 'render_admin_page'],
            'dashicons-editor-ul',
            6
        );
    }

    public function render_admin_page() {
        echo '<div class="wrap"><div id="wp-todo-app"></div></div>';
    }

    public function enqueue_assets($hook) {
        if ($hook !== 'toplevel_page_wp-todo-app') {
            return;
        }

        wp_enqueue_script(
            'wp-todo-app-script',
            plugins_url('../build/index.js', __FILE__),
            ['wp-element', 'wp-data', 'wp-components', 'wp-api-fetch'],
            filemtime(plugin_dir_path(__FILE__) . '../build/index.js'),
            true
        );

        wp_localize_script('wp-todo-app-script', 'wpTodoApp', [
            'nonce' => wp_create_nonce('wp_rest'),
            'apiUrl' => rest_url('wp-todo-app/v1')
        ]);

        wp_enqueue_style(
            'wp-todo-app-tailwind',
            plugins_url('../dist/css/tailwind.css', __FILE__),
            [],
            filemtime(plugin_dir_path(__FILE__) . '../dist/css/tailwind.css')
        );
    }


    public function register_classes() {
        require_once plugin_dir_path(__FILE__) . '/class-wp-todo-api.php';
        
        new WP_Todo_API();
    }
}
