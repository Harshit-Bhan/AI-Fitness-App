import React, { Activity, useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { getMotivationalMessage } from '../assets/assets'
import type { ActivityEntry, FoodEntry } from '../types'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import { ActivityIcon, FlameIcon, HamburgerIcon, Ruler, ScaleIcon, TrendingUp, ZapIcon } from 'lucide-react'
import CaloriesChart from '../components/CaloriesChart'

const Dashboard = () => {

  const {user,allActivityLogs,allFoodLogs} = useAppContext()
  const [todayFood, setTodayFood] = useState<FoodEntry[]>([])
  const [todayActivities, setTodayActivity] = useState<ActivityEntry[]>([])
  const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000;

  const loadUserData = () => {
    const today = new Date().toISOString().split('T')[0]

    const foodData = allFoodLogs.filter((f: FoodEntry) => f.createdAt?.split('T')[0] === today)
    setTodayFood(foodData);

    const activityData = allActivityLogs.filter((a: ActivityEntry) => a.createdAt?.split('T')[0] === today)
    setTodayActivity(activityData);
  }

  console.log("FOOD LOGS:", allFoodLogs.length);
console.log("ACTIVITY LOGS:", allActivityLogs.length);

  useEffect(() => {
    loadUserData();
  },[allActivityLogs, allFoodLogs])

  const totalCalories: number = todayFood.reduce((sum,item) => sum + item.calories,0)

  const remainingCalories: number = DAILY_CALORIE_LIMIT - totalCalories;

  const totalActiveMinutes: number = todayActivities.reduce((sum,item) => sum + item.duration,0)

  const totalBurned: number = todayActivities.reduce((sum,item) => sum + (item.calories || 0),0)

  const motivation = getMotivationalMessage(totalCalories,totalActiveMinutes,DAILY_CALORIE_LIMIT);

  return (
    <div className='page-container'>
      {/* Header */}
      <div className='dashboard-header'>
        <p className='text-emerald-100 text-sm font-medium'>Welcome back</p>
        <h1 className='text-2xl font-bold mt-1 '>{`Hi there! 👋 ${user?.username}`}</h1>

        {/* Motivation Card */}
        <div className='mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4'>
          <div className='flex items-center gap-3'>
            <span className='text-3xl'>{motivation.emoji}</span>
            <p className='text-white font-medium'>{motivation.text}</p>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className='dashboard-grid'>
        {/* Calories Card */}
        <Card className='shadow-lg col-span-2'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center'>
                <HamburgerIcon className='w-6 h-6 text-orange-500'/>
              </div>
              <div>
                <p className='text-sm text-slate-500 dark:text-slate-400'>Calories Consumed</p>
                <p className='text-2xl font-bold text-slate-800 dark:text-white'>{totalCalories}</p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-sm text-slate-500 dark:text-slate-400'>Limit</p>
              <p className='text-2xl font-bold text-slate-800 dark:text-white'>{DAILY_CALORIE_LIMIT}</p>
            </div>
          </div>
          <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT}/>

          <div className='mt-4 flex justify-between items-center'>
            <div className={`px-3 py-1.5 rounded-lg ${remainingCalories >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400' }`}>
              <span className='text-sm font-medium'>
                {remainingCalories >= 0 ? `${remainingCalories} kcal remaining` : `${Math.abs(remainingCalories)} kcal over limit`}
              </span>
            </div>
            <span className='text-sm text-slate-400'>{Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100)}%</span>
          </div>

          <div className='border-t border-slate-100 dark:border-slate-800 my-4'></div>

          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center'>
                <FlameIcon className='w-6 h-6 text-orange-500'/>
              </div>
              <div>
                <p className='text-sm text-slate-500 dark:text-slate-400'>Calories Burned</p>
                <p className='text-2xl font-bold text-slate-800 dark:text-white'>{totalBurned}</p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-sm text-slate-500 dark:text-slate-400'>Goal</p>
              <p className='text-2xl font-bold text-slate-800 dark:text-white'>{user?.dailyCalorieBurn || 400}</p>
            </div>
          </div>
          <ProgressBar value={totalBurned} max={user?.dailyCalorieBurn || 400}/>
        </Card>

        {/* Stats Row */}
        <div className='dashboard-card-grid'>
          {/* Active Minutes */}
          <Card>
            <div className='flex itmes-center gap-3 mb-3'>
              <div className='w-10 h-10 rounded-xl bg-blue-100  flex items-center justify-center'>
                <ActivityIcon className="w-5 h-5 text-blue-500" />
              </div>
              <p className='text-sm text-slate-500'>Active</p>
            </div>
            <p className='text-2xl font-bold text-slate-800 dark:text-white'>{totalActiveMinutes} min</p>
            <p className='text-sm text-slate-500'>minutes today</p>
          </Card>

          {/* Activities Count */}
          <Card>
            <div className='flex itmes-center gap-3 mb-3'>
              <div className='w-10 h-10 rounded-xl bg-purple-100  flex items-center justify-center'>
                <ZapIcon className="w-5 h-5 text-purple-500" />
              </div>
              <p className='text-sm text-slate-500'>Active</p>
            </div>
            <p className='text-2xl font-bold text-slate-800 dark:text-white'>{todayActivities.length} min</p>
            <p className='text-sm text-slate-500'>activites logged</p>
          </Card>
        </div>

        {/* Goal Card */}
        {user && ( // This card will span both columns on large screens
          <Card className='bg-linear-to-r from-slate-800 to-slate-700'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center'>
                <TrendingUp className='w-6 h-6 text-emerald-400' />
              </div>
              <div>
                <p className='text-slate-400 text-sm'>Your Goal</p>
                <p className='text-white font-semibold capitalize'>
                  {user.goal === 'lose' && '🔥 Lose Weight'}
                  {user.goal === 'maintain' && '⚖️ Maintain Weight'}
                  {user.goal === 'gain' && '💪 Gain Muscle'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Body Metrics Card */}
        {user && user.weight && (
          <Card>
            <div className='flex items-center gap-4 mb-6'>
              <div className='w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center'>
                  <ScaleIcon className='w-6 h-6 text-indigo-500'/>
              </div>
              <div>
                <h3 className='font-semibold text-slate-800 dark:text-white'>Body Metrics</h3>
                <p className='text-sm text-slate-500 dark:text-slate-400'>Your stats</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <div className='p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800'>
                    <ScaleIcon className='w-4 h-4 text-slate-500'/>
                  </div>
                  <span className='text-sm text-slate-500 dark:text-slate-400'>Weight</span>
                </div>
                  <span className='font-semibold text-slate-700 dark:text-slate-200'>{user.weight} kg</span>
              </div>
              {user.height && (
                <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <div className='p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800'>
                    <Ruler className='w-4 h-4 text-slate-500'/>
                  </div>
                  <span className='text-sm text-slate-500 dark:text-slate-400'>Height</span>
                </div>
                  <span className='font-semibold text-slate-700 dark:text-slate-200'>{user?.height} kg</span>
              </div>
              )}

              {user.height && (
                <div className='pt-2 border-t border-slate-100 dark:border-slate-800'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                      BMI
                    </span>
                    {(()=>{
                      const bmi = (user.weight / Math.pow(user.height / 100,2)).toFixed(1);
                      const getStatus = (b: number) => {
                        if(b<18.5) return {color: 'text-blue-500',bg:'bg-blue-500'}
                        if(b<25) return {color: 'text-green-500',bg:'bg-green-500'}
                        if(b<30) return {color: 'text-yellow-500',bg:'bg-yellow-500'}
                        return {color: 'text-red-500',bg:'bg-red-500'}
                      }
                      const status = getStatus(Number(bmi));
                      return <span className={`text-lg font-bold ${status.color}`}>{bmi}</span>  
                    })()}
                  </div>

                  {/* BMI Scale Visual */}
                  <div className='h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex'>
                    <div className='w-1/4 bg-blue-500'></div>
                    <div className='w-1/4 bg-green-500'></div>
                    <div className='w-1/4 bg-yellow-500'></div>
                    <div className='w-1/4 bg-red-500'></div>
                  </div>
                  <div className='flex justify-between mt-1'>
                    <span className='text-xs text-slate-500 dark:text-slate-400'>18.5 (Underweight)</span>
                    <span className='text-xs text-slate-500 dark:text-slate-400'>25 (Normal)</span>
                    <span className='text-xs text-slate-500 dark:text-slate-400'>30 (Overweight)</span>
                  </div>

                </div>
              )}

            </div>

          </Card>
        )}

        {/* Quick Summary */}
        <Card>
          <h3 className='font-semibold text-slate-800 dark:text-white mb-4'>Today's Summary</h3>

          <div className='space-y-3'>
            <div className='flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800'>
              <span className='text-slate-500 dark:text-slate-400'>Meals logged</span>
              <span className='font-medium text-slate-700 dark:tet-slate-200'>{todayFood.length}</span>
            </div>
            <div className='flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800'>
              <span className='text-slate-500 dark:text-slate-400'>Total Calories</span>
              <span className='font-medium text-slate-700 dark:tet-slate-200'>{totalCalories} kcal</span>
            </div>
            <div className='flex justify-between items-center py-2 '>
              <span className='text-slate-500 dark:text-slate-400'>Active time</span>
              <span className='font-medium text-slate-700 dark:tet-slate-200'>{totalActiveMinutes} min</span>
            </div>
          </div>

        </Card>

        {/* Activity and Calories Chart */}
        <Card className='col-span-2'>
          <h3 className='font-semibold text-slate-800 dark:text-white mb-2'>This Week's Progress</h3>
          <CaloriesChart />
        </Card>

      </div>
    </div>
  )
}

export default Dashboard
