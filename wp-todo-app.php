<?php
/*
Plugin Name: WP Todo App with Optimistic UI
Description: A modern todo application with optimistic updates in WordPress admin.
Version: 1.0
Author: Your Name
Text Domain: wp-todo-app
*/

defined('ABSPATH') or die('Direct access not allowed');

require_once plugin_dir_path(__FILE__) . 'includes/class-wp-todo-app.php';
require_once plugin_dir_path(__FILE__) . 'includes/class-wp-todo-api.php';

new WP_Todo_App();
