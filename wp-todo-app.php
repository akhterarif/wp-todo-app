<?php
/*
Plugin Name: WP Todo App with Optimistic UI
Description: A modern todo application with optimistic updates in WordPress admin.
Version: 1.0
Author: Your Name
Text Domain: wp-todo-app
*/

defined('ABSPATH') or die('Direct access not allowed');

require_once plugin_dir_path(__FILE__) . 'includes/class-wp-todo-installer.php';
require_once plugin_dir_path(__FILE__) . 'includes/class-wp-todo-app.php';

new WP_Todo_Installer();

// Hook the activation function.
register_activation_hook( __FILE__, array( 'WP_Todo_Installer', 'activate' ) );

new WP_Todo_App();
