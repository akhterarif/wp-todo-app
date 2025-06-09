<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

require_once plugin_dir_path(__FILE__) . '/db/class-wp-todo-db-utils.php';

class WP_Todo_API {

    private $todo_db_utils;

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_api_endpoints']);


        $this->todo_db_utils = new WP_Todo_DB_Utils();
        $this->todo_db_utils->table('wp_todo_items');
    }

    public function register_api_endpoints() {
        register_rest_route('wp-todo-app/v1', '/todos', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_todos'],
                'permission_callback' => [$this, 'check_permission']
            ],
            [
                'methods' => 'POST',
                'callback' => [$this, 'add_todo'],
                'permission_callback' => [$this, 'check_permission']
            ]
        ]);

        register_rest_route('wp-todo-app/v1', '/todos/(?P<id>\\d+)', [
            [
                'methods' => 'POST',
                'callback' => [$this, 'update_todo'],
                'permission_callback' => [$this, 'check_permission']
            ],
            [
                'methods' => 'DELETE',
                'callback' => [$this, 'delete_todo'],
                'permission_callback' => [$this, 'check_permission']
            ]
        ]);
    }

    public function check_permission() {
        return current_user_can('manage_options');
    }

    public function get_todos() {
        $todos = get_option('wp_todo_app_todos', []);
        error_log('Todos fetched: ' . print_r($todos, true)); // Debugging line
        $todos = array_map(function($todo) {
            return (object) $todo;
        }, $todos);
        return new WP_REST_Response($todos, 200);
    }

    public function add_todo($request) {
        $new_todo = [
            'title' => sanitize_text_field($request['title']),
            'completed' => false,
            'created_at' => current_time('mysql')
        ];

        $created_todo = $this->todo_db_utils->insert($new_todo, ['%s', '%d', '%s']);

        if (!$created_todo) {
            return new WP_Error('db_error', 'Failed to create todo', ['status' => 500]);
        }

        return new WP_REST_Response($created_todo, 201);
    }

    public function update_todo($request) {
        $id = $request['id'];
        $todo = $request->get_json_params();    

        $updated_todo = array_merge(
            $todo,
            [
                'updated_at' => current_time('mysql')
            ]
        );

        $updated_todo = $this->todo_db_utils->update(
            $updated_todo,
            ['id' => $id],
            ['%s', '%d', '%s'],
            ['%d']
        );


        if ($updated_todo === false) {
            return new WP_Error('db_error', 'Failed to update todo', ['status' => 500]);
        }

        if (empty($updated_todo)) {
            return new WP_Error('not_found', 'Todo not found', ['status' => 404]);
        }


        return new WP_REST_Response($updated_todo, 200);
    }

    public function delete_todo($request) {
        $todos = get_option('wp_todo_app_todos', []);
        $id = $request['id'];

        $new_todos = array_filter($todos, fn($todo) => $todo['id'] != $id);
        update_option('wp_todo_app_todos', $new_todos);

        return new WP_REST_Response(['success' => true], 200);
    }
}

new WP_Todo_API();
