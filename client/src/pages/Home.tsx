import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { Heart, Clock, Calendar, MapPin, Gift } from "lucide-react";

interface JobData {
  nurses: {
    fullTime: any[];
    partTime: any[];
  };
  medicalOffice: {
    fullTime: any[];
    partTime: any[];
  };
  radiologist: {
    fullTime: any[];
    partTime: any[];
  };
  statistics: any;
}

export default function Home() {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [selectedJobType, setSelectedJobType] = useState("nurses");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("fullTime");

  useEffect(() => {
    fetch("/clinic_job_data.json")
      .then((res) => res.json())
      .then((data) => setJobData(data));
  }, []);

  if (!jobData) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>;
  }

  const jobTypeLabels = {
    nurses: "看護師",
    medicalOffice: "医療事務",
    radiologist: "放射線技師",
  };

  const currentJobs = jobData[selectedJobType as keyof JobData][selectedEmploymentType as keyof typeof jobData.nurses];
  const stats = jobData.statistics[selectedJobType as keyof typeof jobData.statistics];
  const currentStats = stats[selectedEmploymentType as keyof typeof stats];

  // チャート用データ作成
  const chartData = [
    {
      name: "平均",
      value: currentStats.average,
      type: "average",
    },
    {
      name: "最高",
      value: currentStats.max,
      type: "max",
    },
    {
      name: "最低",
      value: currentStats.min,
      type: "min",
    },
  ];

  const isFullTime = selectedEmploymentType === "fullTime";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* ナビゲーションバー */}
      <nav className="bg-pink-600 text-white px-4 py-3 shadow-md">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <div className="font-bold text-lg">医療職求人比較レポート</div>
          <div className="flex gap-4">
            <a href="/" className="px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-600 transition-colors">阿佐ヶ谷版</a>
            <a href="/machida.html" className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 transition-colors">町田版</a>
          </div>
        </div>
      </nav>
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-pink-600 to-cyan-400 text-white py-8 px-4 shadow-lg">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">阿佐ヶ谷周辺クリニック医療職求人比較レポート</h1>
          <p className="text-sm text-teal-200 mt-2">2026年1月調查 | 阿佐ヶ谷周辺エリア</p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container max-w-6xl mx-auto py-12 px-4">
        {/* フィルターセクション */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-teal-200">
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

          <Card className="border-teal-200">
            <CardHeader>
              <CardTitle className="text-lg">雇用形態を選択</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => setSelectedEmploymentType("fullTime")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedEmploymentType === "fullTime"
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                正社員
              </button>
              <button
                onClick={() => setSelectedEmploymentType("partTime")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedEmploymentType === "partTime"
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                パート・アルバイト
              </button>
            </CardContent>
          </Card>
        </div>

        {/* 統計情報 */}
        <Card className="mb-8 border-teal-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle>給与統計（{jobTypeLabels[selectedJobType as keyof typeof jobTypeLabels]}・{selectedEmploymentType === "fullTime" ? "正社員" : "パート"}）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg border border-teal-200">
                <p className="text-sm text-teal-600 font-semibold mb-2">平均</p>
                <p className="text-3xl font-bold text-teal-700">
                  {isFullTime ? `¥${(currentStats.average / 10000).toFixed(1)}万` : `¥${currentStats.average}`}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-semibold mb-2">最高</p>
                <p className="text-3xl font-bold text-green-700">
                  {isFullTime ? `¥${(currentStats.max / 10000).toFixed(1)}万` : `¥${currentStats.max}`}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-600 font-semibold mb-2">最低</p>
                <p className="text-3xl font-bold text-orange-700">
                  {isFullTime ? `¥${(currentStats.min / 10000).toFixed(1)}万` : `¥${currentStats.min}`}
                </p>
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
                    formatter={(value) => isFullTime ? `¥${((value as number) / 10000).toFixed(1)}万` : `¥${value}`}
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
                        <p className="text-xs text-slate-600">給与</p>
                        <p className="font-bold text-teal-700">
                          {isFullTime ? `¥${((job.salary as number) / 10000).toFixed(1)}万/月` : `¥${job.hourlyWage}/時間`}
                        </p>
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
        <div className="mt-12 p-6 bg-pink-50 rounded-lg border border-pink-200 text-center">
          <div className="mb-4 pb-4 border-b border-pink-200">
            <a href="/machida.html" className="text-pink-600 hover:text-pink-500 font-semibold transition-colors">町田・相模大野版を見る →</a>
          </div>
          <p className="text-sm text-slate-600">
            このレポートは株式会社HOAPがリサーチ・作成したものです。
          </p>
          <p className="text-xs text-slate-500 mt-2 font-semibold">
            無断転用及び無断複製を厳禁します。
          </p>
        </div>
      </main>
    </div>
  );
}
