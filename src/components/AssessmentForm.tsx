import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Car, Bike, Send, Upload, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useWantedVehicles, getCarModels, getBikeModels } from "@/hooks/useWantedVehicles";

const carSchema = z.object({
  vehicleType: z.literal("car"),
  modelName: z.string().min(1, "車種名を入力してください"),
  displacement: z.string().optional(),
  fuelType: z.enum(["gasoline", "diesel", "hybrid", "electric"]).optional(),
  transmission: z.enum(["mt", "at", "cvt"]).optional(),
  handlePosition: z.enum(["right", "left"]).optional(),
  year: z.string().optional(),
  mileage: z.string().optional(),
  touchPenMarks: z.boolean().optional(),
  accidentHistory: z.boolean().optional(),
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

const bikeSchema = z.object({
  vehicleType: z.literal("bike"),
  modelName: z.string().min(1, "車種名を入力してください"),
  displacement: z.string().optional(),
  hasCustom: z.boolean().default(false),
  customDetails: z.string().optional(),
  engineStatus: z.enum(["running", "not_running"]).optional(),
  inspectionRemaining: z.string().optional(),
  touchPenMarks: z.boolean().optional(),
  accidentHistory: z.boolean().optional(),
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type CarFormData = z.infer<typeof carSchema>;
type BikeFormData = z.infer<typeof bikeSchema>;

interface AssessmentFormProps {
  formRef: React.RefObject<HTMLDivElement>;
}

const AssessmentForm = ({ formRef }: AssessmentFormProps) => {
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data: vehicles = [] } = useWantedVehicles();
  
  const carModels = getCarModels(vehicles);
  const bikeModels = getBikeModels(vehicles);
  const carForm = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      vehicleType: "car",
      modelName: "",
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const bikeForm = useForm<BikeFormData>({
    resolver: zodResolver(bikeSchema),
    defaultValues: {
      vehicleType: "bike",
      modelName: "",
      hasCustom: false,
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const onSubmit = async (data: CarFormData | BikeFormData) => {
    setIsSubmitting(true);
    
    try {
      const insertData = {
        vehicle_type: data.vehicleType as "car" | "bike",
        manufacturer: "-",
        model_name: data.modelName,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        notes: data.notes || null,
        ...(data.vehicleType === "car" && {
          displacement: (data as CarFormData).displacement ? parseInt((data as CarFormData).displacement!) : null,
          fuel_type: (data as CarFormData).fuelType || null,
          transmission: (data as CarFormData).transmission || null,
          handle_position: (data as CarFormData).handlePosition || null,
          year: (data as CarFormData).year ? parseInt((data as CarFormData).year!) : null,
          mileage: (data as CarFormData).mileage ? parseInt((data as CarFormData).mileage!) : null,
          touch_pen_marks: (data as CarFormData).touchPenMarks ?? null,
          accident_history: (data as CarFormData).accidentHistory ?? null,
        }),
        ...(data.vehicleType === "bike" && {
          displacement: (data as BikeFormData).displacement ? parseInt((data as BikeFormData).displacement!) : null,
          has_custom: (data as BikeFormData).hasCustom,
          custom_details: (data as BikeFormData).customDetails || null,
          engine_status: (data as BikeFormData).engineStatus || null,
          inspection_remaining: (data as BikeFormData).inspectionRemaining || null,
          touch_pen_marks: (data as BikeFormData).touchPenMarks ?? null,
          accident_history: (data as BikeFormData).accidentHistory ?? null,
        }),
      };

      const { error } = await supabase.from("assessment_requests").insert(insertData);

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("査定申し込みを受け付けました！", {
        description: "担当者より24時間以内にご連絡いたします。",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("送信に失敗しました", {
        description: "お手数ですが、もう一度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section ref={formRef} className="py-20 bg-card relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-12 rounded-3xl bg-gradient-to-b from-secondary/50 to-secondary/20 border border-primary/30">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-4xl mb-4 text-gradient">お申し込み完了</h2>
              <p className="text-muted-foreground text-lg mb-6">
                査定申し込みを受け付けました。
                <br />
                担当者より24時間以内にご連絡いたします。
              </p>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  setIsSubmitted(false);
                  carForm.reset();
                  bikeForm.reset();
                }}
              >
                新しい査定を申し込む
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={formRef} className="py-20 bg-card relative overflow-hidden" id="assessment-form">
      <div className="absolute inset-0 garage-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            FREE ASSESSMENT
          </span>
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            <span className="text-gradient">無料査定</span>申し込み
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            必要事項を入力して送信するだけ。24時間以内に査定額をお知らせします。
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-secondary/50 to-secondary/20 border border-border/50">
            {/* Vehicle Type Tabs */}
            <Tabs 
              value={vehicleType} 
              onValueChange={(v) => setVehicleType(v as "car" | "bike")} 
              className="mb-8"
            >
              <TabsList className="grid w-full grid-cols-2 h-16 bg-secondary/50">
                <TabsTrigger 
                  value="car" 
                  className="flex items-center gap-2 font-display text-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Car className="w-6 h-6" />
                  自動車
                </TabsTrigger>
                <TabsTrigger 
                  value="bike" 
                  className="flex items-center gap-2 font-display text-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Bike className="w-6 h-6" />
                  バイク
                </TabsTrigger>
              </TabsList>

              {/* Car Form */}
              <TabsContent value="car">
                <Form {...carForm}>
                  <form onSubmit={carForm.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={carForm.control}
                      name="modelName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>車種を選択 *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-input border-border/50">
                                <SelectValue placeholder="車種を選択してください" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {carModels.map((model) => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={carForm.control}
                        name="displacement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>排気量 (cc)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="例: 2800" {...field} className="h-12 bg-input border-border/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={carForm.control}
                        name="fuelType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>燃料</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-input border-border/50">
                                  <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="gasoline">ガソリン</SelectItem>
                                <SelectItem value="diesel">ディーゼル</SelectItem>
                                <SelectItem value="hybrid">ハイブリッド</SelectItem>
                                <SelectItem value="electric">電気</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={carForm.control}
                        name="transmission"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>トランスミッション</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-input border-border/50">
                                  <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mt">MT（マニュアル）</SelectItem>
                                <SelectItem value="at">AT（オートマ）</SelectItem>
                                <SelectItem value="cvt">CVT</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={carForm.control}
                        name="handlePosition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ハンドル位置</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-input border-border/50">
                                  <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="right">右ハンドル</SelectItem>
                                <SelectItem value="left">左ハンドル</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={carForm.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>年式</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="例: 2015" {...field} className="h-12 bg-input border-border/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={carForm.control}
                        name="mileage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>走行距離 (km)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="例: 150000" {...field} className="h-12 bg-input border-border/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={carForm.control}
                        name="touchPenMarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>タッチペン跡</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(value === "true")} 
                              defaultValue={field.value === true ? "true" : field.value === false ? "false" : undefined}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-input border-border/50">
                                  <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="true">ある</SelectItem>
                                <SelectItem value="false">なし</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={carForm.control}
                        name="accidentHistory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>事故歴</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(value === "true")} 
                              defaultValue={field.value === true ? "true" : field.value === false ? "false" : undefined}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-input border-border/50">
                                  <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="true">あり</SelectItem>
                                <SelectItem value="false">なし</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact Info */}
                    <div className="pt-6 border-t border-border/50">
                      <h3 className="font-display text-xl mb-4 text-foreground">お客様情報</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={carForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>お名前 *</FormLabel>
                              <FormControl>
                                <Input placeholder="山田 太郎" {...field} className="h-12 bg-input border-border/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={carForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>メールアドレス *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="example@email.com" {...field} className="h-12 bg-input border-border/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-4">
                        <FormField
                          control={carForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>電話番号</FormLabel>
                              <FormControl>
                                <Input placeholder="090-1234-5678" {...field} className="h-12 bg-input border-border/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-4">
                        <FormField
                          control={carForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>備考</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="車両の状態やご要望など" 
                                  {...field} 
                                  className="min-h-24 bg-input border-border/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="xl" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "送信中..."
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          無料査定を申し込む
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Bike Form */}
              <TabsContent value="bike">
                <Form {...bikeForm}>
                  <form onSubmit={bikeForm.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={bikeForm.control}
                      name="modelName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>車種を選択 *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-input border-border/50">
                                <SelectValue placeholder="車種を選択してください" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bikeModels.map((model) => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bikeForm.control}
                      name="displacement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>排気量 (cc)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="例: 400" {...field} className="h-12 bg-input border-border/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={bikeForm.control}
                        name="engineStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>エンジン状態</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-input border-border/50">
                                  <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="running">実働（エンジンかかる）</SelectItem>
                                <SelectItem value="not_running">不動（エンジンかからない）</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={bikeForm.control}
                        name="inspectionRemaining"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>車検の残り</FormLabel>
                            <FormControl>
                              <Input placeholder="例: 2024年12月まで" {...field} className="h-12 bg-input border-border/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={bikeForm.control}
                      name="hasCustom"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-secondary/20">
                          <div>
                            <FormLabel className="text-base font-medium">カスタムの有無</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              カスタムパーツもプラス査定対象です
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {bikeForm.watch("hasCustom") && (
                      <FormField
                        control={bikeForm.control}
                        name="customDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>カスタム内容</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="カスタムパーツや改造内容を入力してください（例：マフラー交換、シート変更など）" 
                                {...field} 
                                className="min-h-[100px] bg-input border-border/50" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={bikeForm.control}
                        name="touchPenMarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>タッチペン跡</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(value === "true")} 
                              defaultValue={field.value === true ? "true" : field.value === false ? "false" : undefined}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-input border-border/50">
                                  <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="true">ある</SelectItem>
                                <SelectItem value="false">なし</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={bikeForm.control}
                        name="accidentHistory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>事故歴</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(value === "true")} 
                              defaultValue={field.value === true ? "true" : field.value === false ? "false" : undefined}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-input border-border/50">
                                  <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="true">あり</SelectItem>
                                <SelectItem value="false">なし</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact Info */}
                    <div className="pt-6 border-t border-border/50">
                      <h3 className="font-display text-xl mb-4 text-foreground">お客様情報</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={bikeForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>お名前 *</FormLabel>
                              <FormControl>
                                <Input placeholder="山田 太郎" {...field} className="h-12 bg-input border-border/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={bikeForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>メールアドレス *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="example@email.com" {...field} className="h-12 bg-input border-border/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-4">
                        <FormField
                          control={bikeForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>電話番号</FormLabel>
                              <FormControl>
                                <Input placeholder="090-1234-5678" {...field} className="h-12 bg-input border-border/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-4">
                        <FormField
                          control={bikeForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>備考</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="バイクの状態やカスタム内容など" 
                                  {...field} 
                                  className="min-h-24 bg-input border-border/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="xl" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "送信中..."
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          無料査定を申し込む
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentForm;
