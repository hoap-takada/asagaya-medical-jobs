import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Heart, Clock, Calendar, MapPin, Gift } from "lucide-react";

interface JobData {
  nurses: any[];
  medicalOffice: any[];
  statistics: any;
}

export default function MachidaPartTime() {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [selectedJobType, setSelectedJobType] = useState("nurses");

  useEffect(() => {
    fetch("/machida_extended_jobs.json")
      .then((res) => res.json())
      .then((data) => setJobData(data));
  }, []);

  if (!jobData) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>;
  }

  const jobTypeLabels = {
    nurses: "看護師",
    medicalOffice: "医療事務",
  };

  const currentJobs = jobData[selectedJobType as keyof JobData];
  const stats = jobData.statistics[selectedJobType as keyof typeof jobData.statistics];

  // チャート用データ作成
  const chartData = [
    {
      name: "平均",
      value: stats.average,
    },
    {
      name: "最高",
      value: stats.max,
    },
    {
      name: "最低",
      value: stats.min,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-12 px-4 shadow-lg">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">多摩地域 パート時給比較レポート</h1>
          <p className="text-lg text-teal-100">看護師・医療事務のパート時給を徹底比較</p>
          <p className="text-sm text-teal-200 mt-2">2026年1月調査 | 町田・相模大野・八王子・立川・日野エリア | パート・アルバイト限定</p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container max-w-6xl mx-auto py-12 px-4">
        {/* フィルターセクション */}
        <Card className="mb-8 border-teal-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">職種を選択</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(jobTypeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedJobType(key)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedJobType === key
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* 統計情報 */}
        <Card className="mb-8 border-teal-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle>時給統計（{jobTypeLabels[selectedJobType as keyof typeof jobTypeLabels]}・パート）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg border border-teal-200">
                <p className="text-sm text-teal-600 font-semibold mb-2">平均時給</p>
                <p className="text-3xl font-bold text-teal-700">¥{stats.average}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-semibold mb-2">最高時給</p>
                <p className="text-3xl font-bold text-green-700">¥{stats.max}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-600 font-semibold mb-2">最低時給</p>
                <p className="text-3xl font-bold text-orange-700">¥{stats.min}</p>
              </div>
            </div>

            {/* チャート */}
            <div className="bg-slate-50 p-6 rounded-lg">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `¥${value}`}
                    contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" }}
                  />
                  <Bar dataKey="value" fill="#0d7c7c" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 求人一覧 */}
        <Card className="border-teal-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle>求人詳細情報</CardTitle>
            <CardDescription>{currentJobs.length}件の求人</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentJobs.map((job: any, index: number) => (
                <div
                  key={job.id}
                  className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-all hover:border-teal-300 bg-gradient-to-r from-white to-slate-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{job.name}</h3>
                      <p className="text-sm text-slate-600">{job.type}</p>
                    </div>
                    <Badge variant="secondary" className="bg-teal-100 text-teal-700 border-teal-300">
                      {index + 1}/{currentJobs.length}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-teal-100 p-2 rounded-lg">
                        <Heart className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">時給</p>
                        <p className="font-bold text-teal-700">¥{job.hourlyWage}/時間</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-teal-100 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">勤務地</p>
                        <p className="font-semibold text-slate-900">{job.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-teal-100 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">勤務時間</p>
                        <p className="font-semibold text-slate-900">{job.workHours}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-teal-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">休日</p>
                        <p className="font-semibold text-slate-900">{job.holiday}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="bg-teal-100 p-2 rounded-lg mt-0.5">
                      <Gift className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 mb-2">福利厚生</p>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* フッター */}
        <div className="mt-12 p-6 bg-teal-50 rounded-lg border border-teal-200 text-center">
          <p className="text-sm text-slate-600">
            このレポートは2026年1月に町田・相模大野エリアの医療職パート求人情報を調査した結果です。
          </p>
          <p className="text-xs text-slate-500 mt-2">
            情報は変動する可能性があります。最新情報は各施設にお問い合わせください。
          </p>
        </div>
      </main>
    </div>
  );
}
