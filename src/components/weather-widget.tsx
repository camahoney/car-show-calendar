import { WeatherData, isPerfectWeather } from "@/lib/weather";
import { Cloud, CloudRain, Sun, Thermometer, Wind, Umbrella, Award } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WeatherWidgetProps {
    data: WeatherData | null;
    eventDate: Date;
    rainPolicy: string;
}

export function WeatherWidget({ data, eventDate, rainPolicy }: WeatherWidgetProps) {
    if (!data) return null;

    // Find forecast for the event day
    const eventDayStr = eventDate.toDateString();
    const forecast = data.daily.find(d => new Date(d.dt * 1000).toDateString() === eventDayStr);

    if (!forecast) {
        return (
            <div className="glass p-6 rounded-2xl flex items-center gap-4 text-muted-foreground">
                <Cloud className="h-8 w-8" />
                <p>Weather forecast not available for this date yet.</p>
            </div>
        );
    }

    const isPerfect = isPerfectWeather(forecast.temp.max, forecast.weather[0].main);

    return (
        <div className="glass p-0 rounded-2xl overflow-hidden border border-white/10">
            <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/5">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Sun className="h-5 w-5 text-yellow-500" /> Event Day Forecast
                </h3>
                {isPerfect && (
                    <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-500/50 hover:bg-yellow-500/30">
                        <Award className="w-3 h-3 mr-1" /> Perfect Car Show Weather
                    </Badge>
                )}
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <div className="flex items-center gap-2">
                        {/* We could map icons properly here, simplified for now */}
                        <img
                            src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                            alt={forecast.weather[0].description}
                            className="w-10 h-10 -ml-2"
                        />
                        <span className="font-medium capitalize">{forecast.weather[0].description}</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <div className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-rose-400" />
                        <span className="font-medium">
                            {Math.round(forecast.temp.max)}° / {Math.round(forecast.temp.min)}°
                        </span>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Precipitation</p>
                    <div className="flex items-center gap-2">
                        <Umbrella className={cn("h-5 w-5", forecast.pop > 0.3 ? "text-blue-400" : "text-green-400")} />
                        <span className="font-medium">{(forecast.pop * 100).toFixed(0)}% Chance</span>
                    </div>
                </div>

                {forecast.pop > 0.2 && rainPolicy !== 'NONE' && (
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Rain Policy</p>
                        <div className="flex items-center gap-2">
                            <CloudRain className="h-5 w-5 text-orange-400" />
                            <span className="font-medium text-xs break-words">
                                {rainPolicy === 'RAIN_OR_SHINE' && "Rain or Shine"}
                                {rainPolicy.includes('RAIN_DATE') && "Check Rain Date"}
                                {rainPolicy === 'TBD' && "Check Updates"}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
