import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Dumbbell, Zap, Clock, LayoutDashboard, ListChecks, Search, X, Menu, ShieldCheck, Target, Repeat, PlayCircle, Info, Brain, Sparkles, Loader2, FilterX, CalendarDays, Footprints, Weight, StretchHorizontal, Moon, ListPlus, SlidersHorizontal, Save, MessageSquare, Trash2, Star, Sun, RefreshCw, HelpCircle, ChevronLeft } from 'lucide-react';

// Options for AI Planner
const categorizedSportsOptions = [
  { category: "--- Select Sport ---", options: [""] }, 
  { category: "General Fitness", options: ["General Hybrid Fitness", "CrossFit Style Training"] },
  { category: "Endurance Sports", options: ["Running (All Distances)", "Cycling", "Triathlon", "Swimming"] },
  { category: "Strength Sports", options: ["Powerlifting", "Weightlifting (Olympic)", "Strongman"] },
  { category: "Aesthetic Sports", options: ["Bodybuilding"] },
  { category: "Combat Sports", options: ["MMA", "Boxing", "Kickboxing", "Wrestling", "Judo", "BJJ"] },
  { category: "Team Sports", options: ["Soccer", "Basketball", "American Football", "Rugby", "Volleyball", "Hockey"] },
  { category: "Individual Sports", options: ["Tennis", "Golf (Fitness Focus)", "Rock Climbing"] },
  { category: "Recovery & Wellness", options: ["Active Recovery Focus"] }
];

const muscleGroupOptions = ['Full Body', 'Upper Body', 'Lower Body', 'Legs', 'Chest', 'Back', 'Shoulders', 'Arms', 'Core'];
const runningGoalOptions = ['Maintain Current Fitness', 'Improve 5km Time', 'Improve 10km Time', 'Train for Half Marathon (21.1km)', 'Train for Marathon (42.2km)', 'Build Base Mileage (General Endurance)'];

// --- Detailed Exercise Examples ---
const exerciseDatabase = {
    strength: {
        'Full Body': [
            { name: 'Barbell Back Squats', sets: '4-5', reps: '3-5', rest: '120-180s', note: "Heavy, focus on deep, controlled reps. Ensure core is braced." },
            { name: 'Conventional Deadlifts', sets: '1-2', reps: '1-5 (working up to a heavy single/triple)', rest: '180-300s', note: "Maintain neutral spine. Reset between reps if needed." },
            { name: 'Flat Barbell Bench Press', sets: '4-5', reps: '3-5', rest: '120-180s', note: "Elbows tucked slightly, controlled descent to chest." },
            { name: 'Standing Barbell Overhead Press', sets: '4-5', reps: '3-5', rest: '120-180s', note: "Brace core, glutes tight. Full lockout." },
            { name: 'Weighted Pull-ups (or Lat Pulldowns if needed)', sets: '3-4', reps: '4-8', rest: '90-120s', note: "Full range of motion, focus on back engagement." },
            { name: 'Barbell Rows (Pendlay or Yates)', sets: '3-4', reps: '5-8', rest: '90-120s', note: "Maintain a strict torso angle, pull to lower chest/upper abs." },
        ],
        'Upper Body': [ 
            { name: 'Flat Barbell Bench Press', sets: '3-4', reps: '4-6', rest: '120s', target: 'Chest, Shoulders, Triceps' },
            { name: 'Weighted Pull-ups / Lat Pulldowns', sets: '3-4', reps: '5-8', rest: '120s', target: 'Back, Biceps' },
            { name: 'Standing Barbell Overhead Press', sets: '3-4', reps: '4-6', rest: '120s', target: 'Shoulders, Triceps' },
            { name: 'Barbell Rows', sets: '3-4', reps: '6-10', rest: '90s', target: 'Back, Biceps' },
            { name: 'Dumbbell Incline Press', sets: '3', reps: '6-10', rest: '90s', target: 'Chest (Upper), Shoulders' },
            { name: 'Face Pulls', sets: '3', reps: '10-15', rest: '60s', target: 'Rear Delts, Upper Back', note: "Crucial for shoulder health."}
        ],
        'Lower Body': [ 
            { name: 'Barbell Back Squats', sets: '4-5', reps: '3-5', rest: '150s', target: 'Quads, Glutes, Hamstrings' },
            { name: 'Romanian Deadlifts (RDLs)', sets: '3-4', reps: '6-10', rest: '120s', target: 'Hamstrings, Glutes, Lower Back' },
            { name: 'Leg Press', sets: '3-4', reps: '6-10', rest: '120s', target: 'Quads, Glutes' },
            { name: 'Hamstring Curls (Lying or Seated)', sets: '3', reps: '8-12', rest: '90s', target: 'Hamstrings' },
            { name: 'Calf Raises (Standing & Seated)', sets: '3-4', reps: '8-15', rest: '60s', target: 'Calves' },
            { name: 'Glute Bridges / Hip Thrusts (Weighted)', sets: '3', reps: '8-12', rest: '90s', target: 'Glutes'}
        ],
        'Chest': [
            { name: 'Barbell Bench Press', sets: '4', reps: '4-6', rest: '120-180s' }, 
            { name: 'Incline Dumbbell Press', sets: '3-4', reps: '6-10', rest: '90-120s' },
            { name: 'Weighted Dips (Chest Focus)', sets: '3-4', reps: '6-10', rest: '90-120s' },
            { name: 'Decline Barbell/Dumbbell Press', sets: '3', reps: '6-10', rest: '60-90s' }
        ], 
        'Back': [
            { name: 'Weighted Pull-ups / Chin-ups', sets: '4', reps: '5-8 (or AMRAP)', rest: '120-180s' }, 
            { name: 'Barbell Rows (Pendlay/Yates)', sets: '4', reps: '5-8', rest: '120s' },
            { name: 'T-Bar Rows / Chest Supported Rows', sets: '3-4', reps: '8-12', rest: '90-120s' },
            { name: 'Single-Arm Dumbbell Rows', sets: '3', reps: '8-12 per side', rest: '90s' }
        ], 
        'Legs': [ 
            { name: 'Barbell Back Squats', sets: '4-5', reps: '3-6', rest: '150s' }, 
            { name: 'Leg Press', sets: '3-4', reps: '6-10', rest: '120s' },
            { name: 'Walking Lunges (Dumbbell/Barbell)', sets: '3', reps: '8-12 per leg', rest: '90s' },
            { name: 'Stiff-Legged Deadlifts / Good Mornings', sets: '3-4', reps: '8-12', rest: '120s', note: "Hamstring/Glute focus." }
        ], 
        'Shoulders': [
            { name: 'Standing Barbell Overhead Press', sets: '4', reps: '4-6', rest: '120-180s' }, 
            { name: 'Seated Dumbbell Press', sets: '3-4', reps: '6-10', rest: '90-120s' },
            { name: 'Heavy Lateral Raises (Dumbbell/Cable)', sets: '3-4', reps: '8-12', rest: '60-90s', note: "Focus on medial delt." },
            { name: 'Face Pulls / Bent-Over Dumbbell Raises', sets: '3-4', reps: '10-15', rest: '60s', note: "Rear delt & upper back health." }
        ], 
        'Arms': [ 
            { name: 'Close-Grip Bench Press', sets: '3-4', reps: '6-10', rest: '90-120s', target: 'Triceps, Chest' }, 
            { name: 'Barbell Curls', sets: '3-4', reps: '6-10', rest: '90s', target: 'Biceps' },
            { name: 'Skullcrushers / Overhead Dumbbell Extension', sets: '3-4', reps: '8-12', rest: '90s', target: 'Triceps' },
            { name: 'Dumbbell Hammer Curls / Incline Curls', sets: '3', reps: '8-12', rest: '60-90s', target: 'Biceps, Brachialis' }
        ], 
        'Core': [
            { name: 'Weighted Plank / RKC Plank', sets: '3-4', reps: '30-60s hold', rest: '90s' }, 
            { name: 'Hanging Leg Raises / Captain\'s Chair Raises', sets: '3-4', reps: '10-20 (or AMRAP)', rest: '90s' },
            { name: 'Ab Wheel Rollouts', sets: '3-4', reps: '8-15 (or AMRAP)', rest: '90s' },
            { name: 'Cable Woodchoppers / Russian Twists (Weighted)', sets: '3', reps: '10-15 per side', rest: '60s', note: "Rotational strength." }
        ],
    },
    hypertrophy: { 
        'Full Body': [
            { name: 'Dumbbell Goblet Squats', sets: '3-4', reps: '10-15', rest: '60-75s', note: "Keep chest up, descend deep." },
            { name: 'Incline Dumbbell Press', sets: '3-4', reps: '8-12', rest: '60-75s', note: "Focus on stretch and squeeze." },
            { name: 'Seated Cable Rows (Neutral Grip)', sets: '3-4', reps: '10-15', rest: '60-75s', note: "Pull to sternum, retract scapula." },
            { name: 'Dumbbell Shoulder Press', sets: '3-4', reps: '10-15', rest: '60s', note: "Full ROM, avoid locking out elbows." },
            { name: 'Leg Press (Moderate weight, higher reps)', sets: '3', reps: '15-20', rest: '75s' },
            { name: 'Lat Pulldowns (Underhand Grip)', sets: '3', reps: '10-15', rest: '60s' },
            { name: 'Lying Leg Curls', sets: '3', reps: '12-15', rest: '60s', note: "Squeeze hamstrings at the top." },
            { name: 'Dumbbell Bicep Curls (Alternating)', sets: '3', reps: '10-12 per arm', rest: '60s' },
            { name: 'Overhead Rope Tricep Extensions', sets: '3', reps: '12-15', rest: '60s' },
        ],
        'Upper Body': [
            { name: 'Incline Dumbbell Press', sets: '3-4', reps: '8-12', rest: '60-90s', target: 'Chest, Shoulders' },
            { name: 'Flat Dumbbell Press / Machine Chest Press', sets: '3-4', reps: '10-15', rest: '60-90s', target: 'Chest' },
            { name: 'Lat Pulldowns (Wide/Neutral Grip)', sets: '3-4', reps: '10-15', rest: '60-90s', target: 'Back (Lats)' },
            { name: 'Chest-Supported Rows / Machine Rows', sets: '3-4', reps: '10-15', rest: '60-90s', target: 'Back (Mid/Upper)' },
            { name: 'Seated Dumbbell Lateral Raises', sets: '3-4', reps: '12-20 (dropsets optional)', rest: '45-60s', target: 'Shoulders (Medial)' },
            { name: 'Overhead Dumbbell Press', sets: '3', reps: '10-15', rest: '60s', target: 'Shoulders (Anterior)' },
            { name: 'Dumbbell Bicep Curls (Alternating)', sets: '3', reps: '10-15 per arm', rest: '45-60s', target: 'Biceps' },
            { name: 'Rope Tricep Pushdowns', sets: '3', reps: '12-20', rest: '45-60s', target: 'Triceps' },
        ], 
        'Lower Body': [
            { name: 'Leg Press (High Reps)', sets: '4', reps: '15-20', rest: '90s', target: 'Quads, Glutes' },
            { name: 'Hack Squats / Smith Machine Squats', sets: '3-4', reps: '10-15', rest: '90s', target: 'Quads' },
            { name: 'Romanian Deadlifts (Dumbbell/Barbell)', sets: '3-4', reps: '12-15', rest: '60-90s', target: 'Hamstrings, Glutes' },
            { name: 'Walking Lunges (Dumbbells)', sets: '3', reps: '12-15 per leg', rest: '60s', target: 'Quads, Glutes' },
            { name: 'Seated Leg Extensions', sets: '3-4', reps: '15-25 (control negative)', rest: '45-60s', target: 'Quads' },
            { name: 'Lying or Seated Hamstring Curls', sets: '3-4', reps: '12-20', rest: '45-60s', target: 'Hamstrings' },
            { name: 'Standing Calf Raises (Pause at top & bottom)', sets: '4', reps: '15-25', rest: '45s', target: 'Calves' },
            { name: 'Seated Calf Raises', sets: '3', reps: '15-25', rest: '45s', target: 'Calves' },
        ],
        'Chest': [
            { name: 'Incline Dumbbell Press', sets: '3-4', reps: '8-12', rest: '75s', note: "Prioritize upper chest." }, 
            { name: 'Flat Dumbbell Bench Press', sets: '3-4', reps: '10-15', rest: '75s', note: "Focus on stretch and contraction." },
            { name: 'Cable Flyes (High-to-Low & Low-to-High)', sets: '3 each', reps: '12-15', rest: '60s', note: "Target different fiber angles." },
            { name: 'Machine Chest Press / Pec Deck Flyes', sets: '3', reps: '12-15 (focus on squeeze)', rest: '60s', note: "Constant tension." },
            { name: 'Push-ups (Weighted or to failure)', sets: '2-3', reps: 'AMRAP', rest: '60s', note: "Finisher."}
        ], 
        'Back': [
            { name: 'Pull-ups / Assisted Pull-ups / Lat Pulldowns', sets: '3-4', reps: '8-15 (or to failure)', rest: '75s', note: "Vary grip width." }, 
            { name: 'T-Bar Rows / Chest Supported Rows', sets: '3-4', reps: '10-15', rest: '75s', note: "Focus on mid-back thickness." },
            { name: 'Single Arm Dumbbell Rows', sets: '3', reps: '10-15 per side', rest: '60s', note: "Full range of motion." },
            { name: 'Seated Cable Rows (Close Grip)', sets: '3', reps: '12-15', rest: '60s', note: "Squeeze shoulder blades together." },
            { name: 'Face Pulls (Rope Attachment)', sets: '3-4', reps: '15-20', rest: '45s', note: "Rear delts & upper back health." }
        ], 
        'Legs': [ 
            { name: 'Barbell Squats (Moderate weight, controlled tempo)', sets: '3-4', reps: '8-12', rest: '90s', note: "Focus on form and depth." },
            { name: 'Leg Press (Various foot placements for emphasis)', sets: '3-4', reps: '12-20', rest: '75s', note: "High volume." },
            { name: 'Bulgarian Split Squats (Dumbbells)', sets: '3', reps: '10-15 per leg', rest: '60s', note: "Unilateral strength and balance." },
            { name: 'Lying Leg Curls', sets: '3-4', reps: '12-15', rest: '60s', note: "Isolate hamstrings." },
            { name: 'Leg Extensions', sets: '3-4', reps: '15-20', rest: '45-60s', note: "Quad isolation, focus on peak contraction." },
            { name: 'Glute Kickbacks (Cable or Machine)', sets: '3', reps: '15-20 per leg', rest: '45s', note: "Glute isolation."}
        ], 
        'Shoulders': [
            { name: 'Seated Dumbbell Shoulder Press', sets: '3-4', reps: '10-15', rest: '75s', note: "Controlled, full ROM." }, 
            { name: 'Arnold Press', sets: '3-4', reps: '10-15', rest: '60s', note: "Hits all three delt heads." },
            { name: 'Lateral Raises (Dumbbell/Cable - various angles)', sets: '4-5', reps: '12-20 (consider dropsets)', rest: '45s', note: "Focus on medial delt." },
            { name: 'Front Raises (Dumbbell/Cable/Plate)', sets: '3', reps: '12-15', rest: '45s', note: "Isolate anterior delt." },
            { name: 'Bent-Over Dumbbell Raises / Reverse Pec Deck', sets: '3-4', reps: '15-20', rest: '45s', note: "Target rear delts." }
        ], 
        'Arms': [ 
            { name: 'Dumbbell Bicep Curls (Incline/Standing/Concentration)', sets: '3-4', reps: '10-15', rest: '60s', note: "Vary curl type for full development." }, 
            { name: 'Hammer Curls / Rope Hammer Curls', sets: '3', reps: '10-15', rest: '60s', note: "Targets brachialis and brachioradialis." },
            { name: 'Overhead Dumbbell Extension / Rope Pushdowns', sets: '3-4', reps: '12-20', rest: '60s', note: "Focus on tricep stretch and contraction." },
            { name: 'Close-Grip Push-ups / Dips (Bodyweight or Assisted)', sets: '3', reps: 'To failure or 10-15', rest: '60s', note: "Compound for triceps." },
            { name: 'Preacher Curls (Machine or EZ Bar)', sets: '3', reps: '10-12', rest: '60s', note: "Isolates bicep peak."}
        ], 
        'Core': [
            { name: 'Cable Crunches / Machine Crunches', sets: '3-4', reps: '15-25', rest: '45s', note: "Focus on spinal flexion." }, 
            { name: 'Hanging Leg Raises / Captain\'s Chair Leg Raises', sets: '3-4', reps: '12-20 (or to failure)', rest: '60s', note: "Target lower abs." },
            { name: 'Russian Twists (Weighted if possible)', sets: '3', reps: '15-20 per side', rest: '45s', note: "Work obliques." },
            { name: 'Plank Variations (Side Plank, RKC Plank, Stability Ball Plank)', sets: '3', reps: '30-60s hold per variation', rest: '45s', note: "Build isometric strength." },
            { name: 'Back Extensions / Hyperextensions (Bodyweight or Weighted)', sets: '3', reps: '12-15', rest: '60s', note: "Strengthen lower back."}
        ],
    },
    flexibility: { 
        'Dynamic Mobility (Pre-workout)': [
            { name: 'Arm Circles (Forward & Backward)', reps: '10-15 each direction', duration: '30s' },
            { name: 'Leg Swings (Forward & Sideways)', reps: '10-15 per leg/direction', duration: '30s per leg' },
            { name: 'Torso Twists (Standing, controlled)', reps: '10-15 each side', duration: '30s' },
            { name: 'Cat-Cow Stretches', reps: '8-10 cycles', duration: '60s' },
            { name: 'Walking Lunges with Thoracic Rotation', reps: '5-8 per leg', duration: '60s' },
            { name: 'High Knees / Butt Kicks (Light)', duration: '30s each' },
        ],
        'Static Stretching (Post-workout)': [
            { name: 'Chest Stretch (Doorway or Wall)', duration: '30-45s hold x 2 sets' },
            { name: 'Lat Stretch (Hanging from bar or side bend)', duration: '30-45s hold per side x 2 sets' },
            { name: 'Hamstring Stretch (Seated or Standing)', duration: '30-45s hold per leg x 2 sets' },
            { name: 'Quad Stretch (Standing or Lying)', duration: '30-45s hold per leg x 2 sets' },
            { name: 'Hip Flexor Stretch (Kneeling Lunge)', duration: '30-45s hold per leg x 2 sets' },
            { name: 'Glute/Piriformis Stretch (Figure-4 or Pigeon)', duration: '30-45s hold per leg x 2 sets' },
            { name: 'Calf Stretch (Against Wall - Straight & Bent Knee)', duration: '30-45s hold per variation/leg' },
        ],
         'Yoga/Pilates Inspired': [ 
            { name: 'Sun Salutation A (Surya Namaskar A)', reps: '3-5 rounds', note: "Flow with breath." },
            { name: 'Downward-Facing Dog (Adho Mukha Svanasana)', duration: '5-8 breaths hold', note: "Press heels down, lengthen spine." },
            { name: 'Warrior II (Virabhadrasana II)', duration: '5 breaths hold per side', note: "Strong legs, open hips." },
            { name: 'Triangle Pose (Trikonasana)', duration: '5 breaths hold per side', note: "Lengthen both side bodies." },
            { name: 'Plank to Forearm Plank Flow', reps: '5-8 transitions', note: "Engage core." },
            { name: 'Bridge Pose (Setu Bandhasana)', duration: '5-8 breaths hold', note: "Lift hips, engage glutes." },
            { name: 'Reclining Spinal Twist', duration: '5-8 breaths hold per side', note: "Gentle twist, shoulders grounded." },
            { name: 'Savasana (Corpse Pose)', duration: '3-5 minutes', note: "Complete relaxation." },
        ]
    }
};


// --- AI Logic for Generating Weekly Plan ---
const getAdditionalExercisesFromDb = (category, subCategory, count, existingNames = []) => {
    let exercisePool = [];
    // For lifting, subCategory is an array of focuses. We need to aggregate exercises from all these focuses.
    if ((category === 'strength' || category === 'hypertrophy') && Array.isArray(subCategory)) {
        subCategory.forEach(focus => {
            if (exerciseDatabase[category] && exerciseDatabase[category][focus] && Array.isArray(exerciseDatabase[category][focus])) {
                exercisePool.push(...exerciseDatabase[category][focus]);
            }
        });
         // If no specific focus exercises found, or to broaden, add Full Body exercises
        if (exerciseDatabase[category] && exerciseDatabase[category]['Full Body'] && Array.isArray(exerciseDatabase[category]['Full Body'])) {
            exercisePool.push(...exerciseDatabase[category]['Full Body']);
        }
    } else if (category === 'flexibility' && exerciseDatabase[category] && exerciseDatabase[category][subCategory] && Array.isArray(exerciseDatabase[category][subCategory])) {
        exercisePool = exerciseDatabase[category][subCategory];
    } else if (exerciseDatabase[category] && exerciseDatabase[category][subCategory] && Array.isArray(exerciseDatabase[category][subCategory])) { // Single subcategory string
        exercisePool = exerciseDatabase[category][subCategory];
    }


    if (!Array.isArray(exercisePool) || exercisePool.length === 0) {
        console.warn(`Exercise pool for ${category}.${Array.isArray(subCategory) ? subCategory.join('/') : subCategory} is empty or not an array.`);
        return [];
    }
    // Remove duplicates from the aggregated pool first
    const uniquePool = exercisePool.filter((ex, index, self) => index === self.findIndex((e) => e.name === ex.name));

    const available = uniquePool.filter(ex => !existingNames.includes(ex.name));
    return [...available].sort(() => 0.5 - Math.random()).slice(0, count);
};


const generateWeeklyPlan = (inputs) => {
    const { sport, strengthFocus, hypertrophyFocus, runningGoal, focusBalance, trainingDays } = inputs; 
    // focusBalance: -1 (More Running), 0 (Balanced), 1 (More Lifting)

    let plan = [ 
        { day: 'Monday', activity: 'Workout', details: '', trainingProtocol: [] },
        { day: 'Tuesday', activity: 'Workout', details: '', trainingProtocol: [] },
        { day: 'Wednesday', activity: 'Workout', details: '', trainingProtocol: [] },
        { day: 'Thursday', activity: 'Workout', details: '', trainingProtocol: [] },
        { day: 'Friday', activity: 'Workout', details: '', trainingProtocol: [] },
        { day: 'Saturday', activity: 'Workout or Long Activity', details: '', trainingProtocol: [] },
        { day: 'Sunday', activity: 'Full Rest', details: 'Objective: Maximize physical and mental recuperation. Prioritize sleep, nutrition, and stress management. This is crucial for adaptation and progress.', trainingProtocol: [
            { protocolStep: "Primary Focus", description: "Complete rest from structured training.", items: [{ name: 'Full Rest Day', note: 'Focus on recovery.'}] },
            { protocolStep: "Optional Light Activity", description: "If desired, very light, non-strenuous activity like a short walk or gentle stretching.", items: [{ name: 'Gentle Walk (Optional)', duration: '15-20 min'}, { name: 'Light Static Stretching (Optional)', duration: '10-15 min'}]}
        ]},
    ];

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let availableWorkoutDays = dayOrder.slice(0, trainingDays);
    
    // Set non-training days to rest
    dayOrder.forEach(day => {
        if (!availableWorkoutDays.includes(day)) {
            const dayPlan = plan.find(p => p.day === day);
            if (dayPlan) {
                dayPlan.activity = 'Active Recovery / Mobility';
                dayPlan.details = `Objective: Promote recovery or enjoy a different low-stress activity.`;
                dayPlan.trainingProtocol = [
                    { protocolStep: "Activity Choice", description: "Choose one of the following:", items: [
                        {name: 'Easy Cycling or Swimming', duration: '20-30 min (Low Intensity)', type: 'Cardio'}, 
                        {name: 'Full Body Mobility Flow', duration: '20-25 min', type: 'Mobility'},
                        {name: 'Gentle Yoga or Tai Chi', duration: '20-30 min', type: 'Flexibility/Mindfulness'}
                    ]}
                ];
            }
        }
    });

    
    const scheduleActivity = (preferredDays, fallbackDays, activitySetter) => {
        for (const day of preferredDays) {
            if (availableWorkoutDays.includes(day)) {
                activitySetter(plan.find(d => d.day === day));
                availableWorkoutDays = availableWorkoutDays.filter(d => d !== day);
                return true;
            }
        }
        for (const day of fallbackDays) {
             if (availableWorkoutDays.includes(day)) {
                activitySetter(plan.find(d => d.day === day));
                availableWorkoutDays = availableWorkoutDays.filter(d => d !== day);
                return true;
            }
        }
        if (availableWorkoutDays.length > 0) {
            const day = availableWorkoutDays.shift();
            activitySetter(plan.find(d => d.day === day));
            return true;
        }
        return false;
    };

    const getWarmupExercises = (num = 3) => { 
        const exercisesArray = exerciseDatabase.flexibility && exerciseDatabase.flexibility['Dynamic Mobility (Pre-workout)'];
        if (!Array.isArray(exercisesArray)) {
            console.error("AI Planner Error: 'Dynamic Mobility (Pre-workout)' exercises not found or not an array in exerciseDatabase.flexibility. Defaulting to empty.", exerciseDatabase.flexibility);
            return [];
        }
        return [...exercisesArray].sort(() => 0.5 - Math.random()).slice(0, num);
    };
    const getCooldownExercises = (num = 3) => { 
        const exercisesArray = exerciseDatabase.flexibility && exerciseDatabase.flexibility['Static Stretching (Post-workout)'];
        if (!Array.isArray(exercisesArray)) {
            console.error("AI Planner Error: 'Static Stretching (Post-workout)' exercises not found or not an array in exerciseDatabase.flexibility. Defaulting to empty.", exerciseDatabase.flexibility);
            return [];
        }
        return [...exercisesArray].sort(() => 0.5 - Math.random()).slice(0, num);
    };
    const getLiftingExercises = (type, focusAreas, numPrimary = 2, numAccessory = 3) => { 
        let exercises = [];
        if (!focusAreas || focusAreas.length === 0) focusAreas = ['Full Body'];
        const isBroadFocus = focusAreas.includes('Full Body') || focusAreas.includes('Upper Body') || focusAreas.includes('Lower Body');
        
        const exercisesToSelectPerFocus = Math.ceil((numPrimary + numAccessory) / (isBroadFocus ? 1 : focusAreas.length));

        if (isBroadFocus) { 
            const broadFocusKey = focusAreas[0]; 
            if (exerciseDatabase[type] && exerciseDatabase[type][broadFocusKey] && Array.isArray(exerciseDatabase[type][broadFocusKey])) {
                exercises = [...exerciseDatabase[type][broadFocusKey]].sort(() => 0.5 - Math.random()).slice(0, numPrimary + numAccessory);
            }
        } else { 
            focusAreas.forEach(focus => {
                if (exerciseDatabase[type] && exerciseDatabase[type][focus] && Array.isArray(exerciseDatabase[type][focus])) {
                    const groupExercises = [...exerciseDatabase[type][focus]].sort(() => 0.5 - Math.random()).slice(0, exercisesToSelectPerFocus);
                    exercises.push(...groupExercises);
                }
            });
        }
        
        if (exercises.length < (numPrimary + numAccessory) && exerciseDatabase[type] && exerciseDatabase[type]['Full Body'] && Array.isArray(exerciseDatabase[type]['Full Body'])) {
             const needed = (numPrimary + numAccessory) - exercises.length;
             const fallbackAvailable = [...exerciseDatabase[type]['Full Body']].filter(ex => !exercises.find(selEx => selEx.name === ex.name));
             exercises.push(...fallbackAvailable.sort(() => 0.5 - Math.random()).slice(0, needed));
        }
        exercises = exercises.filter((ex, index, self) => index === self.findIndex((e) => e.name === ex.name)); // Remove duplicates
        return exercises.slice(0, numPrimary + numAccessory); 
    };
    
    // Determine number of sessions based on focusBalance and trainingDays
    const totalSessions = trainingDays;
    let numRunningSessions = Math.round(trainingDays * (runningGoal ? (focusBalance < -0.3 ? 0.6 : (focusBalance > 0.3 ? 0.33 : 0.5)) : 0));
    const liftingFocusCount = (strengthFocus?.length || 0) + (hypertrophyFocus?.length || 0);
    let numLiftingSessions = liftingFocusCount > 0 ? totalSessions - numRunningSessions : 0;
    
    // Cap running sessions
    if (runningGoal) {
        if (trainingDays <= 4) numRunningSessions = Math.min(numRunningSessions, 2);
        else numRunningSessions = Math.min(numRunningSessions, 3);
    } else {
        numRunningSessions = 0;
    }
    
    numLiftingSessions = totalSessions - numRunningSessions;
    let numStrengthSessions = 0;
    let numHypertrophySessions = 0;
    
    const strengthEnabled = strengthFocus && strengthFocus.length > 0;
    const hypertrophyEnabled = hypertrophyFocus && hypertrophyFocus.length > 0;

    if (strengthEnabled && hypertrophyEnabled) {
        numStrengthSessions = Math.ceil(numLiftingSessions / 2);
        numHypertrophySessions = Math.floor(numLiftingSessions / 2);
    } else if (strengthEnabled) {
        numStrengthSessions = numLiftingSessions;
    } else if (hypertrophyEnabled) {
        numHypertrophySessions = numLiftingSessions;
    }
    
    let numSportSessions = (sport && !sport.toLowerCase().includes('general') && !sport.toLowerCase().includes('recovery focus') && !sport.toLowerCase().includes('running (all distances)')) ? 1 : 0;
    if(trainingDays - (numRunningSessions + numStrengthSessions + numHypertrophySessions) < 1) {
        numSportSessions = 0;
    }



    // 1. Running Goal
    let runningDaysScheduled = 0;
    const runningDayPreferences = {
        longRun: ['Saturday', 'Monday'],
        speedWork: ['Tuesday', 'Wednesday'],
        tempoOrEasy: ['Thursday', 'Friday']
    };
    let runningWarmupProtocolDesc = `Perform 10-15 minutes of easy jogging, followed by dynamic drills: leg swings (forward/backward, side-to-side), A-skips, B-skips, high knees, butt kicks, and ankle mobility exercises. Include 4-6 x 50-100m strides, building to near target pace for harder sessions.`;
    let runningCooldownProtocolDesc = `Complete 5-10 minutes of easy walking or jogging to gradually lower heart rate. Follow with 5-10 minutes of static stretching, holding each stretch for 30-45 seconds, focusing on hamstrings, quadriceps, calves, hip flexors, and glutes.`;
    const createRunningProtocol = (mainSetName, mainSetNote, mainSetType = 'Main Activity') => [
        { protocolStep: "Warm-up Protocol", description: runningWarmupProtocolDesc, items: getWarmupExercises(4).map(ex => ({...ex, type: 'Warm-up Drill'})) },
        { protocolStep: "Main Set Protocol", description: mainSetNote, items: [{ name: mainSetName, note: mainSetNote.split('\n')[0] , type: mainSetType}]}, 
        { protocolStep: "Cool-down Protocol", description: runningCooldownProtocolDesc, items: getCooldownExercises(4).map(ex => ({...ex, type: 'Cool-down Stretch'})) }
    ];
    
    if (numRunningSessions > 0) {
        scheduleActivity(runningDayPreferences.longRun, availableWorkoutDays, (dayPlan) => {
            dayPlan.activity = `Long Run (${runningGoal})`;
            dayPlan.details = `Objective: Build aerobic endurance specific to your ${runningGoal}.`;
            if (runningGoal.includes('Marathon')) { dayPlan.trainingProtocol = createRunningProtocol('Marathon Long Run', `Your longest run. Increase distance weekly (max ~32-35km). Pace: Easy (Zone 2). Practice fueling.`); }
            else if (runningGoal.includes('Half Marathon')) { dayPlan.trainingProtocol = createRunningProtocol('Half Marathon Long Run', `Increase distance weekly (max ~18-20km). Pace: Easy. Practice fueling.`); }
            else if (runningGoal.includes('10km')) { dayPlan.trainingProtocol = createRunningProtocol('10k Endurance Run (8-12km)', `Run 8-12km. Options: Steady pace, progression run, or broken 10k (2-3 x 2-3km @ 10k pace).`); }
            else if (runningGoal.includes('5km')) { dayPlan.trainingProtocol = createRunningProtocol('5k Specific Endurance (5-8km)', `Run 5-8km steady or a timed 3-5km effort occasionally.`); }
            else { dayPlan.trainingProtocol = createRunningProtocol('Longer Easy Run (50-75 min)', `Run 50-75 min at an easy, conversational pace.`); }
            runningDaysScheduled++;
        });
    }

    if (numRunningSessions >= 2) {
        scheduleActivity(runningDayPreferences.speedWork, availableWorkoutDays, (dayPlan) => {
            dayPlan.activity = `Speed/Interval Run (${runningGoal})`;
            dayPlan.details = `Objective: Improve VO2 max, running economy, and pace for your ${runningGoal}.`;
            if (runningGoal.includes('Marathon')) { dayPlan.trainingProtocol = createRunningProtocol('3-5 x 2-3km Intervals @ MP', `Perform 3-5 reps of 2-3km intervals at target marathon pace. Recovery: 400-800m jog.`); }
            else if (runningGoal.includes('Half Marathon') || runningGoal.includes('10km')) { dayPlan.trainingProtocol = createRunningProtocol('5-8 x 800m-1km Intervals', `Perform 5-8 reps of 800m-1km intervals at 5k-10k pace. Recovery: 400m jog.`); }
            else if (runningGoal.includes('5km')) { dayPlan.trainingProtocol = createRunningProtocol('8-12 x 400m Intervals @ 5k Pace', `Perform 8-12 reps of 400m intervals at 5k pace or faster. Recovery: 200-400m jog/walk.`); }
            else {  dayPlan.activity = `Tempo/Fartlek Run (${runningGoal})`; dayPlan.details = `Objective: Improve lactate threshold or add unstructured speed.`; dayPlan.trainingProtocol = createRunningProtocol('20-30 min Tempo or Fartlek', `Tempo: 20-30 min at comfortably hard pace. Fartlek: 30-40 min easy with 6-8 x 1-2 min surges.`); }
            runningDaysScheduled++;
        });
    }
    
    if (numRunningSessions === 3) {
         scheduleActivity(runningDayPreferences.tempoOrEasy, availableWorkoutDays, (dayPlan) => {
            dayPlan.activity = `Easy/Tempo Run (${runningGoal})`;
            dayPlan.details = `Objective: Aerobic maintenance, recovery, or sustained effort depending on goal.`;
             if (runningGoal.includes('Marathon') || runningGoal.includes('Half Marathon')) { dayPlan.trainingProtocol = createRunningProtocol('20-40 min Tempo Run', `Run 20-40 min at a comfortably hard pace (HM pace).`); }
             else if (runningGoal.includes('10km') || runningGoal.includes('5km')) { dayPlan.trainingProtocol = createRunningProtocol('Easy Run (30-40 min) + Strides', `Run 30-40 min easy. Finish with 4-6 x 100m strides.`); }
             else { dayPlan.trainingProtocol = createRunningProtocol('Easy Run (30-50 min)', `Run 30-50 min at an easy, conversational pace.`); }
            runningDaysScheduled++;
        });
    }


    const assignLiftingSession = (type, focusList, dayPlan) => { 
        const isBroadCategory = focusList.some(f => ['Full Body', 'Upper Body', 'Lower Body'].includes(f));
        let sessionTitleFocus = focusList.join(' & ');
        if (isBroadCategory) {
            sessionTitleFocus = focusList.find(f => ['Full Body', 'Upper Body', 'Lower Body'].includes(f)) || focusList.join(' & ');
        } else if (focusList.length > 2) { 
            sessionTitleFocus = `${focusList.slice(0,2).join(' & ')} & More`;
        }
        const numPrimary = type === 'strength' ? (isBroadCategory ? 3 : (focusList.length > 1 ? 1 : 2) ) : (isBroadCategory ? 2 : 1) ; 
        const numAccessory = type === 'strength' ? (isBroadCategory ? 2 : (focusList.length > 1 ? 2 : 2)) : (isBroadCategory ? 3 : 2);
        dayPlan.activity = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${sessionTitleFocus}`;
        dayPlan.details = `Objective: ${type === 'strength' ? `Increase maximal strength in ${focusList.join(', ')}.` : `Stimulate muscle growth (hypertrophy) in ${focusList.join(', ')}.`}`;
        let warmupDesc = `5-10 min light cardio (e.g., bike, rower, jump rope). Follow with dynamic mobility focusing on the joints and muscles to be worked for the session (e.g., ${getWarmupExercises(3).map(e=>e.name).join(', ')}). For primary lifts, perform 2-3 specific warm-up sets, gradually increasing weight towards your working sets.`;
        let mainWorkoutDesc = `Execute ${numPrimary} primary ${type === 'strength' ? 'compound lifts' : 'exercises'} followed by ${numAccessory} accessory/isolation movements targeting ${focusList.join(', ')}. \n${type === 'strength' ? 'Execution Focus: Utilize heavy weight, aiming for low to moderate repetitions (typically 3-8 reps). Ensure full rest periods (2-5 minutes) between sets to maximize recovery and force output. Focus on explosive concentric (lifting) phases and controlled eccentric (lowering) phases. Aim to progressively overload by increasing weight or reps weekly.' : 'Execution Focus: Use moderate weight with moderate-to-high repetitions (typically 8-15 reps, sometimes up to 20 for isolation). Maintain a controlled tempo (e.g., 2-second eccentric, 0-1 second pause, 1-second concentric) to maximize time under tension. Implement shorter rest periods (60-90 seconds) to accumulate metabolic stress and induce a muscle pump.'}`;
        let cooldownDesc = `5-10 min of static stretching for the primary muscles worked during the session (e.g., ${getCooldownExercises(3).map(e=>e.name).join(', ')}).`;
        dayPlan.trainingProtocol = [
            { protocolStep: "Warm-up Protocol", description: warmupDesc, items: getWarmupExercises(3).map(ex => ({ ...ex, type: 'Warm-up Drill' })) },
            { protocolStep: "Main Workout Protocol", description: mainWorkoutDesc, items: getLiftingExercises(type, focusList, numPrimary, numAccessory).map(ex => ({ ...ex, type: 'Main Lift' })) },
            { protocolStep: "Cool-down Protocol", description: cooldownDesc, items: getCooldownExercises(3).map(ex => ({ ...ex, type: 'Cool-down Stretch' })) }
        ];
    };

    // 2. Strength Focus
    let strengthSessionsScheduled = 0;
    if (strengthFocus.length > 0) {
        for(let i=0; i < numStrengthSessions; i++){
            if(availableWorkoutDays.length === 0) break;
            scheduleActivity(['Monday', 'Wednesday', 'Friday'], availableWorkoutDays, (dayPlan) => {
                let currentStrengthFocus = strengthFocus;
                if (numStrengthSessions > 1 && strengthFocus.length > 1 && strengthFocus.length > i * Math.ceil(strengthFocus.length / numStrengthSessions) ) { 
                    const splitSize = Math.ceil(strengthFocus.length / numStrengthSessions);
                    currentStrengthFocus = strengthFocus.slice(i * splitSize, (i + 1) * splitSize);
                     if(currentStrengthFocus.length === 0) currentStrengthFocus = strengthFocus; 
                } else if (numStrengthSessions > 1 && i > 0) { 
                    currentStrengthFocus = ['Full Body']; 
                }
                assignLiftingSession('strength', currentStrengthFocus, dayPlan);
                if (i > 0) dayPlan.details = `Secondary strength session. ${dayPlan.details}`;
                strengthSessionsScheduled++;
            });
        }
    }
    
    // 3. Hypertrophy Focus
    let hypertrophySessionsScheduled = 0;
    if (hypertrophyFocus.length > 0) {
         for(let i=0; i < numHypertrophySessions; i++){
            if(availableWorkoutDays.length === 0) break;
            scheduleActivity(['Wednesday', 'Friday', 'Monday'], availableWorkoutDays, (dayPlan) => {
                let currentHypertrophyFocus = hypertrophyFocus;
                 if (numHypertrophySessions > 1 && hypertrophyFocus.length > 1 && hypertrophyFocus.length > i * Math.ceil(hypertrophyFocus.length / numHypertrophySessions)) {
                    const splitSize = Math.ceil(hypertrophyFocus.length / numHypertrophySessions);
                    currentHypertrophyFocus = hypertrophyFocus.slice(i * splitSize, (i + 1) * splitSize);
                     if(currentHypertrophyFocus.length === 0) currentHypertrophyFocus = hypertrophyFocus;
                } else if (numHypertrophySessions > 1 && i > 0) {
                    currentHypertrophyFocus = ['Full Body'];
                }
                assignLiftingSession('hypertrophy', currentHypertrophyFocus, dayPlan);
                 if (i > 0) dayPlan.details = `Secondary hypertrophy session. ${dayPlan.details}`;
                hypertrophySessionsScheduled++;
            });
        }
    }
    
    // 4. Sport Specific Training 
    if (numSportSessions > 0 && sport && !sport.toLowerCase().includes('general') && !sport.toLowerCase().includes('recovery focus') && !sport.toLowerCase().includes('running (all distances)')) {
        let sportSessionsCount = 0;
        while(sportSessionsCount < numSportSessions && availableWorkoutDays.length > 0){
            scheduleActivity(availableWorkoutDays, [], (dayPlan) => { 
                dayPlan.activity = `${sport}: Technical Skill & Conditioning`;
                dayPlan.details = `Objective: Develop sport-specific skills, agility, and relevant conditioning for ${sport}.`;
                let sportWarmupDesc = `10-15 min dynamic movements, light cardio, and drills specific to ${sport} (e.g., footwork, ball handling, movement patterns).`;
                let sportMainDesc = `20-30 min focused skill work (e.g., ${sport} techniques, tactical drills, positional play). Follow with 15-20 min sport-specific conditioning (e.g., agility ladder, cone drills, plyometrics, short sprints, or game-simulated intensity drills relevant to ${sport}).`;
                let sportCooldownDesc = `5-10 min light activity (e.g., easy jogging for field sports, light technical work) and static stretching focusing on muscles predominantly used in ${sport}.`;
                
                let sportSkillItems = [];
                let sportConditioningItems = [];

                if (sport.toLowerCase().includes('soccer')) {
                    sportSkillItems = [
                        { name: 'Dribbling Drills (Cones, Agility)', duration: '10 min'},
                        { name: 'Passing & Receiving Drills (Short & Long)', duration: '10 min'},
                        { name: 'Shooting Practice (Stationary & Moving Ball)', duration: '10 min'}
                    ];
                    sportConditioningItems = [
                        { name: 'Agility Ladder & Cone Drills', sets: '3-4', reps: 'various patterns', rest: '60s'},
                        { name: 'Repeated Sprint Ability (e.g., 6x30m sprints, 30s rest)', sets: '2-3', reps: '6 sprints'}
                    ];
                } else if (sport.toLowerCase().includes('basketball')) {
                     sportSkillItems = [
                        { name: 'Ball Handling Drills (Stationary & Moving)', duration: '10 min'},
                        { name: 'Shooting Form & Practice (Free Throws, Jump Shots)', duration: '15 min'},
                        { name: 'Layup & Finishing Drills', duration: '10 min'}
                    ];
                    sportConditioningItems = [
                        { name: 'Defensive Slide Drills (Cone to Cone)', sets: '3-4', reps: '30-45s', rest: '60s'},
                        { name: 'Suicide Sprints / Shuttle Runs', sets: '3-5', reps: 'Full court'}
                    ];
                } else if (sport.toLowerCase().includes('combat')) { 
                    sportSkillItems = [
                        { name: 'Shadow Boxing / Movement Drills', duration: '10-15 min'},
                        { name: 'Heavy Bag Work (Combinations, Power)', sets:'3-5', reps:'2-3 min rounds'},
                        { name: 'Partner Drills / Light Sparring (If applicable)', duration: '10-15 min'}
                    ];
                     sportConditioningItems = [
                        { name: 'High-Intensity Interval Rounds (e.g., Assault Bike, Burpees, Slams)', sets: '3-5', reps: '3 min on, 1 min off'}
                    ];
                } else { 
                     sportSkillItems = [{ name: `${sport} Specific Drills`, duration: '20-30 min' }];
                     sportConditioningItems = [{ name: `${sport} Conditioning`, duration: '15-20 min' }];
                }


                dayPlan.trainingProtocol = [
                    { protocolStep: "Warm-up Protocol", description: sportWarmupDesc, items: [{ name: `Dynamic Warm-up for ${sport}`, duration: '10-15 min', type: 'Warm-up' }] },
                    { protocolStep: "Skill Development Protocol", description: `Focus on refining key techniques and tactical understanding for ${sport}.`, items: sportSkillItems.map(item => ({...item, type: 'Skill'})) },
                    { protocolStep: "Conditioning Protocol", description: `Build endurance, speed, and power specific to the demands of ${sport}.`, items: sportConditioningItems.map(item => ({...item, type: 'Conditioning'})) },
                    { protocolStep: "Cool-down Protocol", description: sportCooldownDesc, items: [{ name: 'Cool-down & Stretch', duration: '5-10 min', type: 'Cool-down' }] }
                ];
                sportSessionsCount++;
            });
        }
    }

    // Fill any truly leftover "Workout" days as Light Active Recovery
     plan.forEach(p => {
        if (p.activity === 'Workout') { 
            p.activity = 'Light Active Recovery / Mobility';
            p.details = `Objective: Promote recovery or enjoy a different low-stress activity.`;
            p.trainingProtocol = [
                { protocolStep: "Activity Choice", description: "Choose one of the following:", items: [
                    {name: 'Easy Cycling or Swimming', duration: '20-30 min (Low Intensity)', type: 'Cardio'}, 
                    {name: 'Full Body Mobility Flow', duration: '20-25 min', type: 'Mobility'},
                    {name: 'Gentle Yoga or Tai Chi', duration: '20-30 min', type: 'Flexibility/Mindfulness'}
                ]}
            ];
        }
    });

    return plan;
};


// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savedPlans, setSavedPlans] = useState([]); // State for saved plans
  const [theme, setTheme] = useState('dark'); // 'light' or 'dark'

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Optional: Save theme preference to localStorage
    // localStorage.setItem('theme', theme);
  }, [theme]);

  // Optional: Load theme from localStorage on initial load
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme');
  //   if (savedTheme) {
  //     setTheme(savedTheme);
  //   }
  // }, []);


  const navigateTo = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); 
    window.scrollTo(0, 0); 
  };

  const addSavedPlan = (planToSave, inputs) => {
    const newSavedPlan = {
        id: `plan-${Date.now()}`, 
        name: `Plan for ${inputs.sport} (${new Date().toLocaleDateString()})`,
        inputs: {...inputs}, 
        plan: planToSave, 
        dateSaved: new Date().toISOString()
    };
    setSavedPlans(prevPlans => [newSavedPlan, ...prevPlans]);
    alert("Plan saved successfully!"); 
  };

  const deleteSavedPlan = (planId) => {
    setSavedPlans(prevPlans => prevPlans.filter(p => p.id !== planId));
  };


  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; 
    };
  }, [isMobileMenuOpen]);

  return (
    <div className={`min-h-screen flex flex-col font-sans ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-slate-200'}`}>
      <Navbar navigateTo={navigateTo} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} theme={theme} toggleTheme={toggleTheme} currentPage={currentPage} />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24 md:pt-28">
        {currentPage === 'home' && <HomePage navigateTo={navigateTo} addSavedPlan={addSavedPlan} />}
        {currentPage === 'savedWorkouts' && <SavedWorkoutsPage savedPlans={savedPlans} navigateTo={navigateTo} deleteSavedPlan={deleteSavedPlan} />}
        {currentPage === 'feedback' && <FeedbackPage />}
      </main>
      <Footer />
    </div>
  );
}

// Navbar
const Navbar = ({ navigateTo, isMobileMenuOpen, setIsMobileMenuOpen, theme, toggleTheme, currentPage }) => {
  const navItems = [
    { label: 'AI Planner', page: 'home', icon: <Brain size={18} /> }, 
    { label: 'Saved Workouts', page: 'savedWorkouts', icon: <Save size={18} /> },
    { label: 'Feedback', page: 'feedback', icon: <MessageSquare size={18} /> },
  ];

  const baseTextColor = theme === 'light' ? 'text-slate-600' : 'text-slate-300'; 
  const hoverTextColor = 'hover:text-orange-600 dark:hover:text-orange-400';
  const activeTextColor = 'text-orange-500 dark:text-orange-400';
  const logoBaseTextColor = theme === 'light' ? 'text-slate-800' : 'text-slate-100'; // For "thetics" part
  const logoAccentColor = 'text-orange-500 dark:text-orange-400';
  const navBgColor = theme === 'light' ? 'bg-white/90 dark:bg-slate-950/90' : 'bg-slate-950/90'; 


  return (
    <nav className={`${navBgColor} backdrop-blur-lg shadow-xl fixed w-full z-50 top-0`}> 
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16"> 
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigateTo('home')}
          >
            <Dumbbell size={32} className={`${logoAccentColor} group-hover:opacity-90 transition-all duration-200 ease-in-out`} />
            <span className={`text-xl md:text-2xl font-bold tracking-normal`}>
                <span className={`${logoAccentColor} group-hover:opacity-80 transition-opacity duration-200 ease-in-out`}>Bans</span>
                <span className={`${logoBaseTextColor} group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-200 ease-in-out`}>thetics</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center"> 
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => navigateTo(item.page)}
                className={`flex items-center space-x-1.5 transition-colors px-3 py-2 rounded-md text-sm font-semibold group
                            ${currentPage === item.page 
                                ? `${activeTextColor} ` 
                                : `${baseTextColor} ${hoverTextColor}`
                            }
                           `} 
              >
                {React.cloneElement(item.icon, { className: `transition-colors ${currentPage === item.page ? activeTextColor : `group-hover:${logoAccentColor}`}`})}
                <span>{item.label}</span>
              </button>
            ))}
             <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-full ${baseTextColor} ${hoverTextColor} hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-3`}
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center">
             <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-full ${baseTextColor} ${hoverTextColor} hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mr-1`}
            >
                {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${baseTextColor} ${hoverTextColor} focus:outline-none p-2 rounded-md`}
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-900'} absolute w-full left-0 top-16 shadow-xl rounded-b-lg border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}> 
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => navigateTo(item.page)}
                className={`w-full flex items-center space-x-3  transition-colors px-3 py-3 rounded-md text-sm font-medium group
                            ${currentPage === item.page 
                                ? `${activeTextColor} ${theme === 'light' ? 'bg-orange-50' : 'bg-orange-500/10'}` 
                                : `${baseTextColor} ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} ${hoverTextColor}`
                            }
                `} 
              >
                {React.cloneElement(item.icon, { size: 20, className: `transition-colors ${currentPage === item.page ? activeTextColor : `group-hover:${logoAccentColor}`}`})}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Toggle Switch Component - NOW DEFINED
const ToggleSwitch = ({ enabled, setEnabled }) => {
    return (
        <button
            type="button"
            className={`${
                enabled ? 'bg-orange-500 dark:bg-orange-600' : 'bg-slate-300 dark:bg-slate-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:ring-offset-slate-800`}
            role="switch"
            aria-checked={enabled}
            onClick={setEnabled}
        >
            <span
                aria-hidden="true"
                className={`${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    );
};


// AI Planner Page (HomePage)
const HomePage = ({ navigateTo, addSavedPlan }) => { 
  const [preferences, setPreferences] = useState({
      includeSport: true,
      includeRunning: true,
      includeStrength: true,
      includeHypertrophy: false,
  });
  
  const [selectedSport, setSelectedSport] = useState(categorizedSportsOptions[1]?.options[0] || ""); 
  const [strengthFocus, setStrengthFocus] = useState([]); 
  const [hypertrophyFocus, setHypertrophyFocus] = useState([]); 
  const [selectedRunningGoal, setSelectedRunningGoal] = useState(runningGoalOptions[0]);
  const [focusBalance, setFocusBalance] = useState(0); 
  const [trainingDays, setTrainingDays] = useState(6);
  
  const [currentInputs, setCurrentInputs] = useState(null); 
  const [generatedWeeklyPlan, setGeneratedWeeklyPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = (pref) => {
      setPreferences(prev => {
          const newState = {...prev, [pref]: !prev[pref]};
          // Reset data if toggled off
          if (pref === 'includeSport' && !newState.includeSport) setSelectedSport('');
          if (pref === 'includeStrength' && !newState.includeStrength) setStrengthFocus([]);
          if (pref === 'includeHypertrophy' && !newState.includeHypertrophy) setHypertrophyFocus([]);
          if (pref === 'includeRunning' && !newState.includeRunning) setSelectedRunningGoal('');
          return newState;
      });
  };

  const handleMultiSelectChange = (setter, currentValue, option) => {
    if (currentValue.includes(option)) {
      setter(currentValue.filter(item => item !== option));
    } else {
      setter([...currentValue, option]);
    }
  };

  const handleGeneratePlan = () => {
    if (preferences.includeSport && !selectedSport) {
        setError("Please select your Primary Sport or toggle the section off.");
        return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedWeeklyPlan(null); 
    const inputsForPlan = { 
        sport: preferences.includeSport ? selectedSport : '', 
        strengthFocus: preferences.includeStrength ? strengthFocus : [], 
        hypertrophyFocus: preferences.includeHypertrophy ? hypertrophyFocus : [], 
        runningGoal: preferences.includeRunning ? selectedRunningGoal : '',
        focusBalance: parseFloat(focusBalance),
        trainingDays: parseInt(trainingDays, 10),
    };
    setCurrentInputs(inputsForPlan); 

    setTimeout(() => {
      const plan = generateWeeklyPlan(inputsForPlan);
      setGeneratedWeeklyPlan(plan);
      setIsLoading(false);
    }, 2000); 
  };

  const handleSavePlan = () => {
    if (generatedWeeklyPlan && currentInputs) {
        addSavedPlan(generatedWeeklyPlan, currentInputs);
    } else {
        alert("Please generate a plan first before saving.");
    }
  };

  const getSliderLabel = () => {
    if (focusBalance < -0.3) return "Focus: More Running";
    if (focusBalance > 0.3) return "Focus: More Lifting";
    return "Focus: Balanced Hybrid";
  };

  const handleGenerateMoreExercises = (day, protocolStepName) => {
    if (!generatedWeeklyPlan || !currentInputs) return;

    const newPlan = JSON.parse(JSON.stringify(generatedWeeklyPlan)); // Deep copy
    const dayIndex = newPlan.findIndex(d => d.day === day);
    if (dayIndex === -1) return;

    const protocolIndex = newPlan[dayIndex].trainingProtocol.findIndex(p => p.protocolStep === protocolStepName);
    if (protocolIndex === -1) return;

    const currentProtocolStep = newPlan[dayIndex].trainingProtocol[protocolIndex];
    const existingExerciseNames = currentProtocolStep.items.map(item => item.name);
    
    let exerciseCategory = '';
    let exerciseSubCategory = []; // Can be an array for lifting focuses

    if (protocolStepName.toLowerCase().includes('warm-up')) {
        exerciseCategory = 'flexibility';
        exerciseSubCategory = 'Dynamic Mobility (Pre-workout)';
    } else if (protocolStepName.toLowerCase().includes('cool-down')) {
        exerciseCategory = 'flexibility';
        exerciseSubCategory = 'Static Stretching (Post-workout)';
    } else if (protocolStepName.toLowerCase().includes('main workout')) {
        if (newPlan[dayIndex].activity.toLowerCase().includes('strength')) {
            exerciseCategory = 'strength';
            exerciseSubCategory = currentInputs.strengthFocus; 
            const activityTitleFocuses = newPlan[dayIndex].activity.split(': ')[1];
            if (activityTitleFocuses && !activityTitleFocuses.toLowerCase().includes('full body') && !activityTitleFocuses.toLowerCase().includes('upper body') && !activityTitleFocuses.toLowerCase().includes('lower body')) {
                exerciseSubCategory = activityTitleFocuses.split(' & ').map(s => s.replace(' Focus', '').trim());
            }


        } else if (newPlan[dayIndex].activity.toLowerCase().includes('hypertrophy')) {
            exerciseCategory = 'hypertrophy';
            exerciseSubCategory = currentInputs.hypertrophyFocus; 
            const activityTitleFocuses = newPlan[dayIndex].activity.split(': ')[1];
             if (activityTitleFocuses && !activityTitleFocuses.toLowerCase().includes('full body') && !activityTitleFocuses.toLowerCase().includes('upper body') && !activityTitleFocuses.toLowerCase().includes('lower body')) {
                exerciseSubCategory = activityTitleFocuses.split(' & ').map(s => s.replace(' Focus', '').trim());
            }
        }
    }

    if (exerciseCategory && exerciseSubCategory) {
        const additionalExercises = getAdditionalExercisesFromDb(exerciseCategory, exerciseSubCategory, 2, existingExerciseNames);
        if (additionalExercises.length > 0) {
            currentProtocolStep.items.push(...additionalExercises.map(ex => ({...ex, type: 'Additional'})));
        } else {
            if (!currentProtocolStep.items.find(item => item.name === "No more unique exercises found")) {
                 currentProtocolStep.items.push({ name: "No more unique exercises found for this selection.", type: "Info" });
            }
        }
        setGeneratedWeeklyPlan(newPlan);
    }
};


  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight flex items-center justify-center dark:text-slate-100 text-slate-900">
          <Brain size={60} className="mr-4 text-orange-500 dark:text-orange-400" />
          AI Hybrid <span className="text-orange-500 dark:text-orange-400 ml-2">Routine Builder</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Craft your weekly hybrid training plan. Balance strength, endurance, and flexibility.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl">
        <div className="space-y-8 mb-6"> 
          <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
             <label htmlFor="trainingDays" className="block text-base font-semibold text-slate-700 dark:text-slate-100 mb-2">How many days a week will you train?</label>
            <select id="trainingDays" value={trainingDays} onChange={(e) => setTrainingDays(parseInt(e.target.value, 10))}
              className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 py-3 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 outline-none">
                <option value={2}>2 Days</option>
                <option value={3}>3 Days</option>
                <option value={4}>4 Days</option>
                <option value={5}>5 Days</option>
                <option value={6}>6 Days</option>
            </select>
          </div>

          {/* Optional Sections with Toggles */}
          <div className="space-y-8">
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-base font-semibold text-slate-700 dark:text-slate-100">Primary Sport</label>
                    <ToggleSwitch enabled={preferences.includeSport} setEnabled={() => handleToggle('includeSport')} />
                </div>
                {preferences.includeSport && (
                    <select id="sport" value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 py-3 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 outline-none mt-2">
                      {categorizedSportsOptions.map(categoryGroup => (
                        categoryGroup.options[0] === "" ? 
                          <option key={categoryGroup.category} value="">{categoryGroup.category}</option>
                        :
                        <optgroup key={categoryGroup.category} label={categoryGroup.category}>
                          {categoryGroup.options.map(sport => (
                            <option key={sport} value={sport}>{sport}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                )}
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-base font-semibold text-slate-700 dark:text-slate-100">Running Goal</label>
                    <ToggleSwitch enabled={preferences.includeRunning} setEnabled={() => handleToggle('includeRunning')} />
                </div>
                {preferences.includeRunning && (
                    <select id="runningGoal" value={selectedRunningGoal} onChange={(e) => setSelectedRunningGoal(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 py-3 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 outline-none mt-2">
                      {runningGoalOptions.map(goal => <option key={goal} value={goal}>{goal}</option>)}
                    </select>
                )}
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-base font-semibold text-slate-700 dark:text-slate-100">Strength Focus</label>
                    <ToggleSwitch enabled={preferences.includeStrength} setEnabled={() => handleToggle('includeStrength')} />
                </div>
                {preferences.includeStrength && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                    {muscleGroupOptions.map(group => (
                      <button key={group} onClick={() => handleMultiSelectChange(setStrengthFocus, strengthFocus, group)}
                        className={`py-2 px-3 rounded-md text-sm font-medium transition-colors w-full border-2
                          ${strengthFocus.includes(group) ? 'bg-orange-500 dark:bg-orange-600 border-orange-500 dark:border-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-orange-500 dark:hover:border-orange-400 text-slate-700 dark:text-slate-200'}`}>
                        {group}
                      </button>
                    ))}
                  </div>
                )}
            </div>
            
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-base font-semibold text-slate-700 dark:text-slate-100">Hypertrophy Focus</label>
                    <ToggleSwitch enabled={preferences.includeHypertrophy} setEnabled={() => handleToggle('includeHypertrophy')} />
                </div>
                {preferences.includeHypertrophy && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                    {muscleGroupOptions.map(group => (
                      <button key={group} onClick={() => handleMultiSelectChange(setHypertrophyFocus, hypertrophyFocus, group)}
                        className={`py-2 px-3 rounded-md text-sm font-medium transition-colors w-full border-2
                          ${hypertrophyFocus.includes(group) ? 'bg-orange-500 dark:bg-orange-600 border-orange-500 dark:border-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-orange-500 dark:hover:border-orange-400 text-slate-700 dark:text-slate-200'}`}>
                        {group}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
        
        {(preferences.includeRunning && (preferences.includeStrength || preferences.includeHypertrophy)) && (
            <div className="mb-8 md:col-span-2">
                <label htmlFor="focusBalance" className="block text-base font-semibold text-slate-700 dark:text-slate-100 mb-2 flex items-center">
                    <SlidersHorizontal size={20} className="mr-2 text-orange-500 dark:text-orange-400"/> Training Focus Balance: <span className="ml-2 font-normal text-orange-500 dark:text-orange-400">{getSliderLabel()}</span>
                </label>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400">More Running</span>
                    <input 
                        type="range" 
                        id="focusBalance"
                        min="-1" 
                        max="1" 
                        step="0.1" 
                        value={focusBalance} 
                        onChange={(e) => setFocusBalance(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500 dark:accent-orange-400"
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">More Lifting</span>
                </div>
            </div>
        )}
        
        {error && <p className="text-red-500 dark:text-red-400 text-center mb-4">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-102 focus:outline-none focus:ring-4 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin mr-3" />
                  Building Your Plan...
                </>
              ) : (
                <>
                  <Sparkles size={24} className="mr-3" />
                  Generate My Weekly Plan
                </>
              )}
            </button>
            {generatedWeeklyPlan && !isLoading && (
                 <button
                    onClick={handleSavePlan}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-102 focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 flex items-center justify-center"
                >
                    <Save size={24} className="mr-3" />
                    Save This Plan
                </button>
            )}
        </div>
      </div>

      {(!isLoading && generatedWeeklyPlan) && (
        <div className="mt-12">
          <h2 className="text-4xl font-extrabold text-center mb-10 tracking-tight text-slate-900 dark:text-slate-100">
            Your AI-Generated Weekly Hybrid Plan
          </h2>
          <div className="space-y-8"> 
            {generatedWeeklyPlan.map((dayPlan) => (
              <DayCard key={dayPlan.day} dayPlan={dayPlan} handleGenerateMoreExercises={handleGenerateMoreExercises} currentInputs={currentInputs} />
            ))}
          </div>
           <p className="text-center mt-10 text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            <strong>Important:</strong> This is a sample plan. Adjust intensity, volume, exercise selection, and rest based on your current fitness level, experience, and how your body feels. Always prioritize proper form and listen to your body. Consider consulting with a qualified coach or healthcare professional.
          </p>
        </div>
      )}
      
      {(!isLoading && !generatedWeeklyPlan && !error && !isLoading) && ( 
         <div className="mt-12 text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl">
            <CalendarDays size={48} className="mx-auto text-orange-500 dark:text-orange-400 mb-4" />
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Ready to Build Your Plan?</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Select your preferences above and let our AI craft a tailored hybrid training schedule for you.
            </p>
         </div>
      )}
    </div>
  );
};

// Saved Workouts Page Component
const SavedWorkoutsPage = ({ savedPlans, navigateTo, deleteSavedPlan }) => {
    const [viewingPlan, setViewingPlan] = useState(null);
    const [tempCurrentInputs, setTempCurrentInputs] = useState(null); 

    const handleViewPlan = (plan) => {
        setViewingPlan(plan);
        setTempCurrentInputs(plan.inputs); 
    }

    const dummyGenerateMoreHandler = () => {
        alert("To generate more exercises for a saved plan, please first load it into the AI Planner or create a new plan with similar inputs.");
    };


    if (viewingPlan) {
        return (
            <div className="max-w-4xl mx-auto">
                 <button
                    onClick={() => {setViewingPlan(null); setTempCurrentInputs(null);}}
                    className="mb-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                    <ChevronLeft size={20} className="mr-2" />
                    Back to Saved Plans
                </button>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">{viewingPlan.name}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-2 text-sm">Saved on: {new Date(viewingPlan.dateSaved).toLocaleDateString()}</p>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                    Original Inputs: Sport - {viewingPlan.inputs.sport || 'None'}, Running Goal - {viewingPlan.inputs.runningGoal || 'None'}, 
                    Strength - {viewingPlan.inputs.strengthFocus?.join(', ') || 'None'}, 
                    Hypertrophy - {viewingPlan.inputs.hypertrophyFocus?.join(', ') || 'None'},
                    Balance - {viewingPlan.inputs.focusBalance < -0.3 ? "Running" : viewingPlan.inputs.focusBalance > 0.3 ? "Lifting" : "Balanced"}
                </p>
                <div className="space-y-8">
                    {viewingPlan.plan.map(dayPlan => (
                        <DayCard key={dayPlan.day} dayPlan={dayPlan} handleGenerateMoreExercises={dummyGenerateMoreHandler} currentInputs={tempCurrentInputs} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-4xl font-extrabold mb-8 text-center tracking-tight text-slate-900 dark:text-slate-100">Saved Workout Plans</h2>
            {savedPlans.length === 0 ? (
                <p className="text-center text-slate-600 dark:text-slate-400 text-xl">You haven't saved any workout plans yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedPlans.map(plan => (
                        <div key={plan.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-orange-500/30 dark:hover:shadow-orange-400/30 transition-shadow flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-orange-500 dark:text-orange-400 mb-2">{plan.name}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Sport: {plan.inputs.sport || 'N/A'}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Running Goal: {plan.inputs.runningGoal || 'N/A'}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Saved: {new Date(plan.dateSaved).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => handleViewPlan(plan)}
                                    className="flex-1 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                                >
                                    View Plan
                                </button>
                                <button
                                    onClick={() => deleteSavedPlan(plan.id)}
                                    className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors"
                                >
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Feedback Page Component
const FeedbackPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedbackType, setFeedbackType] = useState('general');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, email, feedbackType, rating, message });
        setSubmitted(true);
        setTimeout(() => {
            setName(''); setEmail(''); setFeedbackType('general'); setMessage(''); setRating(0); setSubmitted(false);
        }, 5000);
    };

    if (submitted) {
        return (
            <div className="max-w-lg mx-auto text-center py-12">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">Thank You!</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Your feedback has been received. We appreciate you taking the time to help us improve.</p>
            </div>
        )
    }

    return (
        <div className="max-w-lg mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 text-center tracking-tight text-slate-900 dark:text-slate-100">Provide Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name (Optional)</label>
                    <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)}
                           className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 sm:text-sm text-slate-900 dark:text-slate-100" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email (Optional)</label>
                    <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                           className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 sm:text-sm text-slate-900 dark:text-slate-100" />
                </div>
                <div>
                    <label htmlFor="feedbackType" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Feedback Type</label>
                    <select id="feedbackType" name="feedbackType" value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}
                            className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 sm:text-sm text-slate-900 dark:text-slate-100">
                        <option value="general">General Feedback</option>
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="ux">User Experience</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Overall Rating (Optional)</label>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                                key={star} 
                                size={28} 
                                className={`cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400 dark:text-slate-600 hover:text-yellow-300'}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                    <textarea id="message" name="message" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} required
                              className="mt-1 block w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 sm:text-sm text-slate-900 dark:text-slate-100"></textarea>
                </div>
                <div>
                    <button type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-orange-500 transition-colors">
                        Submit Feedback
                    </button>
                </div>
            </form>
        </div>
    );
};


// Day Card Component to display daily plan
const DayCard = ({ dayPlan, handleGenerateMoreExercises, currentInputs }) => { // Added props
    const [isExpanded, setIsExpanded] = useState(true); 
    const [sessionExplanation, setSessionExplanation] = useState({ text: '', isLoading: false, error: '' });
    const [exerciseDetails, setExerciseDetails] = useState({}); // Store details keyed by exercise name
    const [exerciseDetailLoading, setExerciseDetailLoading] = useState({});


    const fetchApiData = async (prompt) => {
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const apiKey = ""; // API key is handled by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Unexpected API response structure or content missing.");
        }
    };
    
    const handleExplainSession = async () => {
        if(sessionExplanation.text) { // Simple toggle if already fetched
             setSessionExplanation(prev => ({...prev, text: ''}));
             return;
        }
        setSessionExplanation({ text: '', isLoading: true, error: '' });
        const prompt = `I am a hybrid athlete who likes ${currentInputs.sport}. My running goal is to ${currentInputs.runningGoal}. My lifting focuses are ${currentInputs.strengthFocus.join(', ')} (strength) and ${currentInputs.hypertrophyFocus.join(', ')} (size). Today's workout is "${dayPlan.activity}". In 2-3 short sentences, explain how this specific workout helps me achieve my overall goals.`;

        try {
            const text = await fetchApiData(prompt);
            setSessionExplanation({ text: text.trim(), isLoading: false, error: '' });
        } catch (error) {
            console.error("Error fetching session explanation:", error);
            setSessionExplanation({ text: '', isLoading: false, error: 'Failed to load explanation. Try again.' });
        }
    };


    const fetchExerciseDetail = async (exerciseName) => {
        if (exerciseDetails[exerciseName] && exerciseDetails[exerciseName].text) { // If already loaded and has text
            setExerciseDetails(prev => ({ ...prev, [exerciseName]: { ...prev[exerciseName], isVisible: !prev[exerciseName].isVisible }}));
            return;
        }

        setExerciseDetailLoading(prev => ({ ...prev, [exerciseName]: true }));
        const prompt = `Explain the exercise "${exerciseName}". Briefly cover its primary benefits, 1-2 common mistakes to avoid, and how it contributes to general fitness or the specific training goal if implied (e.g. strength, hypertrophy). Keep it concise (around 50-70 words) and easy to understand.`;
        
        try {
            const text = await fetchApiData(prompt);
            setExerciseDetails(prev => ({ ...prev, [exerciseName]: { text: text.trim(), error: '', isVisible: true } }));
        } catch (error) {
            console.error(`Error fetching details for ${exerciseName}:`, error);
            setExerciseDetails(prev => ({ ...prev, [exerciseName]: { text: '', error: 'Failed to load details.', isVisible: true } }));
        } finally {
            setExerciseDetailLoading(prev => ({ ...prev, [exerciseName]: false }));
        }
    };


    const getIconForActivity = (activity) => {
        if (!activity) return <Dumbbell className="text-slate-500 dark:text-slate-400" />; 
        const lowerActivity = activity.toLowerCase();
        if (lowerActivity.includes('strength') || lowerActivity.includes('hypertrophy')) return <Weight className="text-orange-500 dark:text-orange-400" />;
        if (lowerActivity.includes('run')) return <Footprints className="text-blue-500 dark:text-blue-400" />; 
        if (lowerActivity.includes('flexibility') || lowerActivity.includes('yoga') || lowerActivity.includes('stretch') || lowerActivity.includes('mobility')) return <StretchHorizontal className="text-green-500 dark:text-green-400" />;
        if (lowerActivity.includes('rest') || lowerActivity.includes('active recovery')) return <Moon className="text-purple-500 dark:text-purple-400" />;
        
        const activityFirstWord = activity.split(':')[0].trim().toLowerCase(); 
        const sportNameMatch = categorizedSportsOptions.some(cat => 
            cat.options.some(sportOption => 
                sportOption.toLowerCase() === activityFirstWord || 
                activity.toLowerCase().includes(sportOption.toLowerCase()) 
            )
        );
        if (sportNameMatch || lowerActivity.includes('combat') || lowerActivity.includes('sport specific')) return <ShieldCheck className="text-red-500 dark:text-red-400" />;
        return <Dumbbell className="text-slate-500 dark:text-slate-400" />;
    };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden"> 
      <div className="p-6 md:p-8"> 
        <div className="flex items-start justify-between mb-4"> 
          <div>
            <h3 className="text-3xl font-bold text-orange-500 dark:text-orange-400">{dayPlan.day}</h3> 
             <h4 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-1 mt-1">{dayPlan.activity}</h4> 
          </div>
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full shadow-md"> 
            {React.cloneElement(getIconForActivity(dayPlan.activity), {size: 28})} 
          </div>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 whitespace-pre-line">{dayPlan.details}</p> 

        {/* Gemini Session Explainer */}
        { !dayPlan.activity.toLowerCase().includes('rest') && currentInputs &&
            <div className="my-4">
                <button
                    onClick={handleExplainSession}
                    disabled={sessionExplanation.isLoading}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
                >
                    {sessionExplanation.isLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : <HelpCircle size={16} className="mr-2" />}
                    Understand This Session
                </button>
                {sessionExplanation.text && (
                    <div className="mt-2 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-md text-sm text-blue-800 dark:text-blue-200 relative">
                        <p>{sessionExplanation.text}</p>
                         <button onClick={() => setSessionExplanation({text: '', isLoading: false, error: ''})} className="absolute top-1 right-1 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200">
                             <X size={14}/>
                        </button>
                    </div>
                )}
                 {sessionExplanation.error && <p className="mt-2 text-xs text-red-500 dark:text-red-400">{sessionExplanation.error}</p>}
            </div>
        }
        
        <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left text-lg font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-3"
            >
                <span>Training Protocol</span>
                {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>

            {isExpanded && dayPlan.trainingProtocol && dayPlan.trainingProtocol.length > 0 && (
                <div className="space-y-4">
                    {dayPlan.trainingProtocol.map((protocol, protocolIndex) => (
                        <div key={protocolIndex} className="pl-2 border-l-2 border-orange-500/50 dark:border-orange-400/50">
                            <div className="flex justify-between items-center mb-1">
                                <h5 className="text-md font-semibold text-orange-500 dark:text-orange-400">{protocol.protocolStep}</h5>
                                { protocol.protocolStep.toLowerCase().includes('main workout') && handleGenerateMoreExercises && currentInputs && 
                                    <button 
                                        onClick={() => handleGenerateMoreExercises(dayPlan.day, protocol.protocolStep)}
                                        className="text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center"
                                        title="Generate more exercises for this step"
                                    >
                                        <RefreshCw size={14} className="mr-1"/> More
                                    </button>
                                }
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-2 whitespace-pre-line">{protocol.description}</p>
                            {protocol.items && protocol.items.length > 0 && (
                                <ul className="space-y-2 text-sm list-inside list-none pl-2"> 
                                    {protocol.items.map((ex, index) => (
                                        <li key={index} className="p-2 bg-slate-100 dark:bg-slate-700/30 rounded-md shadow-sm"> 
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-slate-700 dark:text-slate-100">{ex.name}</span>
                                                <div className="flex items-center space-x-2">
                                                    {ex.type && <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{ex.type}</span>}
                                                    {ex.name !== "No more unique exercises found for this selection." && 
                                                        <button 
                                                            onClick={() => fetchExerciseDetail(ex.name)} 
                                                            title={`Get details for ${ex.name}`}
                                                            className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                                                        >
                                                            {exerciseDetailLoading[ex.name] ? <Loader2 size={16} className="animate-spin"/> : <Info size={16}/>}
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                            {(ex.sets || ex.duration || ex.details) && (
                                                <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs">
                                                    {ex.sets && ex.reps && `${ex.sets} sets of ${ex.reps} reps`}
                                                    {ex.duration && `${ex.duration}`}
                                                    {ex.details && !ex.sets && !ex.duration && `${ex.details}`}
                                                    {ex.rest && <span className="ml-2">(Rest: {ex.rest})</span>}
                                                </p>
                                            )}
                                            {ex.note && <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-0.5">({ex.note})</p>}
                                            {/* Display Exercise Details */}
                                            {exerciseDetails[ex.name]?.isVisible && (
                                                <div className="mt-2 p-2 text-xs bg-slate-200 dark:bg-slate-700 rounded">
                                                    {exerciseDetails[ex.name].error ? 
                                                        <p className="text-red-500 dark:text-red-400">{exerciseDetails[ex.name].error}</p> : 
                                                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{exerciseDetails[ex.name].text}</p>
                                                    }
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};


// Footer
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 text-center mt-12">
      <p className="text-slate-500 dark:text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Bansthetics. All Rights Reserved.
      </p>
      <p className="text-slate-400 dark:text-slate-600 text-xs mt-1">
        Engineering by BAnsMax
      </p>
    </footer>
  );
};

// CheckCircle icon (simple SVG as lucide-react might not have it directly or for fallback)
const CheckCircle = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);


export default App;