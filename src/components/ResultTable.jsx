'use client';

import { useState, useMemo } from 'react';
import ResultModal from './ResultModal';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ResultTable({ results }) {
  const [selected, setSelected] = useState(null);
  const [jobRoleFilter, setJobRoleFilter] = useState('');

  // Extract unique job roles from results (from Job Role.resume_value)
  const uniqueRoles = useMemo(() => {
    const set = new Set();
    results.forEach(r => {
      if (r['Job Role'] && r['Job Role'].resume_value) {
        set.add(r['Job Role'].resume_value);
      }
    });
    return Array.from(set);
  }, [results]);

  // Filtered results by job role selection
  const filteredResults =
    jobRoleFilter && jobRoleFilter !== "__all__"
      ? results.filter(r => r['Job Role'] && r['Job Role'].resume_value === jobRoleFilter)
      : results;

  return (
    <>
      <div className="flex items-center gap-4 mt-6">
        <label className="text-sm font-medium">Filter by Job Role:</label>
        <Select value={jobRoleFilter} onValueChange={val => setJobRoleFilter(val)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a job role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All</SelectItem>
            {uniqueRoles.map((role, idx) => (
              <SelectItem key={idx} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Resume Name</th>
              <th className="p-2 border">JD Name</th>
              <th className="p-2 border">Skill %</th>
              <th className="p-2 border">Job Role %</th>
              <th className="p-2 border">Education %</th>
              <th className="p-2 border">Experience %</th>
              <th className="p-2 border">Overall %</th>
              <th className="p-2 border">Ai Score %</th>
              <th className="p-2 border">Shortlisted</th>
              <th className="p-2 border">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((res, i) => (
              <tr key={i} className="text-center border-t">
                <td className="p-2">{res.resumeName ?? '-'}</td>
                <td className="p-2">{res.jdName ?? '-'}</td>
                <td className="p-2">{res.Skills?.match_pct ?? '-'} </td>
                <td className="p-2">{res['Job Role']?.match_pct ?? '-'}</td>
                <td className="p-2">{res.Education?.match_pct ?? '-'}</td>
                <td className="p-2">{res.Experience?.match_pct ?? '-'}</td>
                <td className="p-2">{res.OverallMatchPercentage ?? '-'}</td>
                <td className="p-2">{res.AI_Generated_Estimate_Percentage ?? '-'}</td>
                <td className="p-2">{res.shortlisted ? 'Yes' : 'No'}</td>
                <td className="p-2">
                  <Button variant="link" onClick={() => setSelected(res)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <ResultModal result={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}