<?php

class StatsController extends Controller
{
    /** GET /api/admin/stats */
    public function index(): void
    {
        Auth::require();

        $products = new Product();
        $orders = new Order();
        $contacts = new Contact();
        $subscribers = new Subscriber();

        $this->success([
            'totals' => [
                'products'    => $products->count(),
                'categories'  => (new Category())->count(),
                'orders'      => $orders->count(),
                'messages'    => $contacts->count(),
                'unread'      => $contacts->unreadCount(),
                'subscribers' => $subscribers->activeCount(),
                'revenue'     => $orders->revenue(),
            ],
            'orders_by_status' => $orders->statusCounts(),
            'low_stock'        => $products->lowStock(),
            'recent_orders'    => array_slice($orders->adminListing(), 0, 5),
        ]);
    }
}
