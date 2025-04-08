<?php

class WP_Todo_API {
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_api_endpoints']);
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
        $todos = get_option('wp_todo_app_todos', []);
        $new_todo = [
            'id' => time(),
            'text' => sanitize_text_field($request['text']),
            'completed' => false,
            'created_at' => current_time('mysql')
        ];

        $todos[] = $new_todo;
        update_option('wp_todo_app_todos', $todos);

        return new WP_REST_Response($new_todo, 201);
    }

    public function update_todo($request) {
        $todos = get_option('wp_todo_app_todos', []);
        $id = $request['id'];

        foreach ($todos as &$todo) {
            if ($todo['id'] == $id) {
                if (isset($request['text'])) {
                    $todo['text'] = sanitize_text_field($request['text']);
                }
                if (isset($request['completed'])) {
                    $todo['completed'] = (bool) $request['completed'];
                }

                update_option('wp_todo_app_todos', $todos);
                return new WP_REST_Response($todo, 200);
            }
        }

        return new WP_Error('not_found', 'Todo not found', ['status' => 404]);
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
