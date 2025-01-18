"use client";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Send, ArrowRight } from "lucide-react";
const steps = [
  {
    id: "date",
    question: "いつ頃のことでしょうか？",
    component: "date",
  },
  {
    id: "location",
    question: "どちらで起きたことでしょうか？",
    component: "location",
  },
  {
    id: "urgency",
    question: "緊急性はどの程度でしょうか？",
    component: "urgency",
  },
  {
    id: "description",
    question: "差し支えない範囲で状況を教えていただけますか？",
    component: "description",
  },
];

export default function ReportPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [date, setDate] = useState<Date>();
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("");
  const [description, setDescription] = useState("");

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/report/complete");
    }
  };

  const renderInput = () => {
    const step = steps[currentStep];

    switch (step.component) {
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date
                  ? format(date, "yyyy年MM月dd日", { locale: ja })
                  : "日付を選択"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ja}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "location":
        return (
          <Input
            placeholder="場所を入力"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        );

      case "urgency":
        return (
          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger>
              <SelectValue placeholder="緊急性を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">緊急 - 今すぐ支援が必要</SelectItem>
              <SelectItem value="urgent">
                急ぎ - 24時間以内に対応が必要
              </SelectItem>
              <SelectItem value="standard">
                標準 - 数日以内の対応で問題ない
              </SelectItem>
            </SelectContent>
          </Select>
        );

      case "description":
        return (
          <Textarea
            placeholder="安心してお話しください。ご自身のペースで構いません。"
            className="min-h-[150px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="max-w-2xl mx-auto pt-16">
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "h-2 rounded-full flex-1 mx-1",
                  index <= currentStep
                    ? "bg-sky-400"
                    : "bg-gray-200 dark:bg-gray-700"
                )}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {currentStep + 1} / {steps.length}
          </p>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="bg-sky-50 dark:bg-gray-800 p-4 rounded-lg inline-block">
              <p className="text-lg font-medium">
                {steps[currentStep].question}
              </p>
            </div>

            <div className="space-y-4">
              {renderInput()}

              <Button
                className="w-full bg-sky-400 hover:bg-sky-500"
                onClick={handleNext}
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    送信する
                    <Send className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    次へ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
