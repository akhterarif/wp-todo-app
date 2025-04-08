<?php
/**
 * WP_Todo_DB_Utils
 * A utility class for handling database operations with chainable methods.
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class WP_Todo_DB_Utils {
    private $wpdb;
    private $table;
    private $query;
    private $where = [];
    private $data = [];
    private $format = [];
    private $where_format = [];

    public function __construct() {
        global $wpdb;
        $this->wpdb = $wpdb;
    }

    public function table($table_name) {
        $this->table = $this->wpdb->prefix . $table_name;
        return $this;
    }

    public function select($columns = '*') {
        $this->query = "SELECT $columns FROM {$this->table}";
        return $this;
    }

    public function where($column, $value, $format = '%s', $operator = 'AND') {
        $condition = "$column = $format";
        if (!empty($this->where)) {
            $condition = "$operator $condition";
        }
        $this->where[] = $condition;
        $this->data[] = $value;
        $this->where_format[] = $format;
        return $this;
    }

    public function insert($data, $format = null) {
        $this->data = $data;
        $this->format = $format;
        $this->wpdb->insert($this->table, $this->data, $this->format);
        return $this->wpdb->insert_id;
    }

    public function update($data, $where, $format = null, $where_format = null) {
        $this->wpdb->update($this->table, $data, $where, $format, $where_format);
        return $this;
    }

    public function delete() {
        $where_clause = implode(' ', $this->where);
        $this->query = "DELETE FROM {$this->table} WHERE $where_clause";
        $this->wpdb->query($this->wpdb->prepare($this->query, $this->data));
        return $this;
    }

    public function get_results() {
        if (!empty($this->where)) {
            $where_clause = implode(' ', $this->where);
            $this->query .= " WHERE $where_clause";
        }
        return $this->wpdb->get_results($this->wpdb->prepare($this->query, $this->data));
    }

    public function get_row() {
        if (!empty($this->where)) {
            $where_clause = implode(' ', $this->where);
            $this->query .= " WHERE $where_clause";
        }
        return $this->wpdb->get_row($this->wpdb->prepare($this->query, $this->data));
    }

    public function get_var() {
        if (!empty($this->where)) {
            $where_clause = implode(' ', $this->where);
            $this->query .= " WHERE $where_clause";
        }
        return $this->wpdb->get_var($this->wpdb->prepare($this->query, $this->data));
    }

    public function reset() {
        $this->query = null;
        $this->where = [];
        $this->data = [];
        $this->format = [];
        $this->where_format = [];
        return $this;
    }
}