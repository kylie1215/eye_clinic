<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with('user:id,name,email')->orderBy('created_at', 'desc');

        // Filter archived/active logs
        if ($request->filled('show_archived') && $request->show_archived === 'true') {
            $query->whereNotNull('archived_at');
        } else {
            $query->whereNull('archived_at');
        }

        // Filter by action
        if ($request->filled('action') && $request->action !== 'all') {
            $query->where('action', $request->action);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('description', 'like', "%{$request->search}%")
                  ->orWhere('action', 'like', "%{$request->search}%")
                  ->orWhereHas('user', function ($q) use ($request) {
                      $q->where('name', 'like', "%{$request->search}%");
                  });
            });
        }

        $logs = $query->paginate(10);

        return response()->json($logs);
    }

    public function show(AuditLog $auditLog)
    {
        $auditLog->load('user:id,name,email,role');
        return response()->json($auditLog);
    }

    public function stats()
    {
        $totalLogs = AuditLog::whereNull('archived_at')->count();
        $todayLogs = AuditLog::whereNull('archived_at')->whereDate('created_at', today())->count();
        $weekLogs = AuditLog::whereNull('archived_at')->where('created_at', '>=', now()->subWeek())->count();
        $archivedLogs = AuditLog::whereNotNull('archived_at')->count();
        
        $actionBreakdown = AuditLog::whereNull('archived_at')
            ->selectRaw('action, COUNT(*) as count')
            ->groupBy('action')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'total' => $totalLogs,
            'today' => $todayLogs,
            'this_week' => $weekLogs,
            'archived' => $archivedLogs,
            'action_breakdown' => $actionBreakdown,
        ]);
    }

    public function archive(AuditLog $auditLog)
    {
        $auditLog->update(['archived_at' => now()]);
        return response()->json(['message' => 'Audit log archived successfully']);
    }

    public function unarchive(AuditLog $auditLog)
    {
        $auditLog->update(['archived_at' => null]);
        return response()->json(['message' => 'Audit log unarchived successfully']);
    }

    public function bulkArchive(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:audit_logs,id',
        ]);

        AuditLog::whereIn('id', $request->ids)->update(['archived_at' => now()]);
        
        return response()->json(['message' => 'Audit logs archived successfully']);
    }
}
