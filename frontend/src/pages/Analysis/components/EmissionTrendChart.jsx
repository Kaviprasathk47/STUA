import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MicroTip from '../../../components/ui/MicroTip';

const EmissionTrendChart = ({ data }) => {

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-80">
                <p className="text-muted-foreground">No trend data available.</p>
            </div>
        )
    }

    return (
        <div>
            <MicroTip
                text="This chart shows how your emissions change over time—higher bars indicate greater carbon impact."
                variant="info"
                className="mb-4"
            />
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                        <XAxis
                            dataKey="_id"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            dy={10}
                            tickFormatter={(str) => {
                                const date = new Date(str);
                                return `${date.getMonth() + 1}/${date.getDate()}`;
                            }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(value) => [`${value.toFixed(2)} kg`, 'CO₂ Emission']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid hsl(var(--border))',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                backgroundColor: 'hsl(var(--card))',
                                color: 'hsl(var(--foreground))'
                            }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="totalEmission"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EmissionTrendChart;

