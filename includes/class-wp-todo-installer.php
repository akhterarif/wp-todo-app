<?php
/**
 * Handles the plugin activation tasks.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

class WP_Todo_Installer {

    /**
     * Runs on plugin activation.
     */
    public static function activate() {
        // Create custom database tables or set default options here.
        self::create_todos_tables();
        self::create_todo_categories_table();
        // Set default options for the plugin.
        self::set_default_options();
    }

    /**
     * Create necessary database tables.
     */
    private static function create_todos_tables() {
        global $wpdb;

        $table_name = $wpdb->prefix . 'wp_todo_items';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            user_id BIGINT(20) UNSIGNED NOT NULL,
            completed TINYINT(1) NOT NULL DEFAULT 0,
            category_id BIGINT(20) UNSIGNED,
            priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            scheduled_at DATETIME,
            FOREIGN KEY (category_id) REFERENCES {$wpdb->prefix}wp_todo_categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
            PRIMARY KEY (id)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
    }

    /**
     * Create necessary database table for todo categories or projects.
     */
    private static function create_todo_categories_table() {
        global $wpdb;

        $table_name = $wpdb->prefix . 'wp_todo_categories';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
    }

    /**
     * Set default options for the plugin.
     */
    private static function set_default_options() {
        add_option( 'wp_todo_default_status', 'pending' );
    }
}

// Hook the activation function.
register_activation_hook( __FILE__, array( 'WP_Todo_Installer', 'activate' ) );