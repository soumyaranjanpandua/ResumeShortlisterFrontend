'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import ResultModal from '@/components/ResultModal';
import axios from 'axios';
import { normalizeHistory } from '@/lib/normalizeResults';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:8000';

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page = 1) => {
    try {
      // get paginated data
      const res = await axios.get(`${API_BASE}/history`, {
        params: { page, limit: 8 },
      });

      console.log("Response Data:", res.data);

      const normalized = normalizeHistory(res.data);
      setData(normalized);

      // ✅ compute total pages separately
      const allRes = await axios.get(`${API_BASE}/history`, {
        params: { page: 1, limit: 100000 }, // big number to fetch all
      });

      const totalRecords = allRes.data.length;
      setTotalPages(Math.ceil(totalRecords / 8));
      setPage(page);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Resume Analysis History</h1>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Resume</th>
              <th className="p-2 border">JD</th>
              <th className="p-2 border">Skill</th>
              <th className="p-2 border">Job Role</th>
              <th className="p-2 border">Edu</th>
              <th className="p-2 border">Exp</th>
              <th className="p-2 border">Overall</th>
              <th className="p-2 border">AI</th>
              <th className="p-2 border">Shortlisted</th>
              {/* <th className="p-2 border">Date</th> */}
              <th className="p-2 border">View</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((r, idx) => (
                <tr key={idx} className="border-t text-center">
                  <td className="p-2">{r.resumeName}</td>
                  <td className="p-2">{r.jdName}</td>
                  <td className="p-2">{r.Skills?.match_pct ?? '-'}</td>
                  <td className="p-2">{r["Job Role"]?.match_pct ?? '-'}</td>
                  <td className="p-2">{r.Education?.match_pct ?? '-'}</td>
                  <td className="p-2">{r.Experience?.match_pct ?? '-'}</td>
                  <td className="p-2">{r.OverallMatchPercentage ?? '-'}</td>
                  <td className="p-2">{r.AI_Generated_Estimate_Percentage ?? '-'}</td>
                  <td className="p-2">{r.shortlisted ? 'Yes' : 'No'}</td>
                  {/* <td className="p-2">
                    {r.scannedAt ? new Date(r.scannedAt).toLocaleDateString() : '-'}
                  </td> */}
                  <td className="p-2">
                    <Button variant="link" onClick={() => setSelected(r)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-500">
                  No history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className={page === 1 ? 'opacity-50 pointer-events-none' : ''}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-4 py-1">Page {page} of {totalPages}</span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className={page === totalPages ? 'opacity-50 pointer-events-none' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {selected && (
        <ResultModal result={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
