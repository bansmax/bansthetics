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

const muscleGroupOptions = ['Full Body', 'Legs', 'Chest', 'Back', 'Shoulders', 'Arms', 'Core'];
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
            { name: 'Clean and Jerk', sets: '5', reps: '1-3', rest: '180s', note: "Explosive, technical lift. Focus on form." },
            { name: 'Snatch', sets: '5', reps: '1-3', rest: '180s', note: "Highly technical. Focus on speed and precision." },
            { name: 'Farmer\'s Walk', sets: '3', reps: '20-30 meters', rest: '90s', note: "Use heavy dumbbells or farmer's handles." },
            { name: 'Strongman Log Press', sets: '3-5', reps: '1-5', rest: '120-180s', note: 'Explosive and powerful upper body movement.' },
            { name: 'Atlas Stone Lifts', sets: '3', reps: '3-5 (over bar or to platform)', rest: '180s', note: 'Ultimate full-body strength test. Prioritize safe technique.' },
            { name: 'Tire Flips', sets: '4', reps: '3-5 flips', rest: '120s', note: 'Explosive full-body power. Choose appropriate tire weight.' }
        ],
        'Chest': [
            { name: 'Barbell Bench Press', sets: '4', reps: '4-6', rest: '120-180s' }, 
            { name: 'Incline Dumbbell Press', sets: '3-4', reps: '6-10', rest: '90-120s' },
            { name: 'Weighted Dips (Chest Focus)', sets: '3-4', reps: '6-10', rest: '90-120s' },
            { name: 'Decline Barbell/Dumbbell Press', sets: '3', reps: '6-10', rest: '60-90s' },
            { name: 'Floor Press (Barbell/Dumbbell)', sets: '3-4', reps: '4-6', rest: '120s', note: 'Builds lockout strength, easier on shoulders.'},
            { name: 'Spoto Press', sets: '3', reps: '5-8', rest: '90s', note: 'Pause 1 inch off the chest to build control and power.'}
        ], 
        'Back': [
            { name: 'Weighted Pull-ups / Chin-ups', sets: '4', reps: '5-8 (or AMRAP)', rest: '120-180s' }, 
            { name: 'Barbell Rows (Pendlay/Yates)', sets: '4', reps: '5-8', rest: '120s' },
            { name: 'T-Bar Rows / Chest Supported Rows', sets: '3-4', reps: '8-12', rest: '90-120s' },
            { name: 'Single-Arm Dumbbell Rows', sets: '3', reps: '8-12 per side', rest: '90s' },
            { name: 'Deficit Deadlifts (1-2 inch)', sets: '3', reps: '3-5', rest: '180s', note: 'Increases range of motion for more power off the floor.' },
            { name: 'Rack Pulls (from below knee)', sets: '3', reps: '2-5', rest: '180s', note: 'Overload the top portion of the deadlift.' },
            { name: 'Kroc Rows', sets: '1-2', reps: '15-25 per arm', rest: '90s', note: 'High-rep heavy dumbbell rows for grip and back thickness.' }
        ], 
        'Legs': [ 
            { name: 'Barbell Back Squats', sets: '4-5', reps: '3-6', rest: '150s' }, 
            { name: 'Leg Press', sets: '3-4', reps: '6-10', rest: '120s' },
            { name: 'Walking Lunges (Dumbbell/Barbell)', sets: '3', reps: '8-12 per leg', rest: '90s' },
            { name: 'Stiff-Legged Deadlifts / Good Mornings', sets: '3-4', reps: '8-12', rest: '120s', note: "Hamstring/Glute focus." },
            { name: 'Pause Squats', sets: '3', reps: '3-5 (3-second pause)', rest: '150s', note: 'Builds strength out of the hole.' },
            { name: 'Safety Bar Squats', sets: '3-4', reps: '5-8', rest: '120s', note: 'Less stress on shoulders, great for upper back.' },
            { name: 'Anderson Squats', sets: '3', reps: '3-5', rest: '120s', note: 'Starting from a dead stop at the bottom.' }
        ], 
        'Shoulders': [
            { name: 'Standing Barbell Overhead Press', sets: '4', reps: '4-6', rest: '120-180s' }, 
            { name: 'Seated Dumbbell Press', sets: '3-4', reps: '6-10', rest: '90-120s' },
            { name: 'Heavy Lateral Raises (Dumbbell/Cable)', sets: '3-4', reps: '8-12', rest: '60-90s', note: "Focus on medial delt." },
            { name: 'Face Pulls / Bent-Over Dumbbell Raises', sets: '3-4', reps: '10-15', rest: '60s', note: "Rear delt & upper back health." },
            { name: 'Push Press', sets: '3-5', reps: '3-5', rest: '120s', note: 'Use leg drive to move heavier weight.' },
            { name: 'Behind the Neck Press (if mobility allows)', sets: '3', reps: '5-8', rest: '120s', note: 'Caution required. Great for shoulder stability.' },
            { name: 'Viking Press', sets: '3', reps: '6-10', rest: '90s', note: 'Neutral grip press, common in strongman.' }
        ], 
        'Arms': [ 
            { name: 'Close-Grip Bench Press', sets: '3-4', reps: '6-10', rest: '90-120s', target: 'Triceps, Chest' }, 
            { name: 'Barbell Curls', sets: '3-4', reps: '6-10', rest: '90s', target: 'Biceps' },
            { name: 'Skullcrushers / Overhead Dumbbell Extension', sets: '3-4', reps: '8-12', rest: '90s', target: 'Triceps' },
            { name: 'Dumbbell Hammer Curls / Incline Curls', sets: '3', reps: '8-12', rest: '60-90s', target: 'Biceps, Brachialis' },
            { name: 'Weighted Dips (Tricep Focus)', sets: '3-4', reps: '6-10', rest: '90s', note: 'Stay upright to target triceps.' },
            { name: 'JM Press', sets: '3', reps: '8-12', rest: '90s', note: 'Hybrid between close-grip press and skullcrusher.' },
            { name: 'Cheat Curls (Heavy Barbell)', sets: '3', reps: '4-6', rest: '90s', note: 'Use slight momentum to overload biceps.' },
            { name: 'Bicep 21s', sets: '2-3', reps: '21 per set', rest: '60s', note: '7 bottom half, 7 top half, 7 full reps.' }
        ], 
        'Core': [
            { name: 'Weighted Plank / RKC Plank', sets: '3-4', reps: '30-60s hold', rest: '90s' }, 
            { name: 'Hanging Leg Raises / Captain\'s Chair Raises', sets: '3-4', reps: '10-20 (or AMRAP)', rest: '90s' },
            { name: 'Ab Wheel Rollouts', sets: '3-4', reps: '8-15 (or AMRAP)', rest: '90s' },
            { name: 'Cable Woodchoppers / Russian Twists (Weighted)', sets: '3', reps: '10-15 per side', rest: '60s', note: "Rotational strength." },
            { name: 'Suitcase Carries', sets: '3', reps: '20-30 meters per side', rest: '60s', note: 'Excellent anti-lateral flexion core work.' },
            { name: 'Sled Drags/Pulls (Heavy)', sets: '4', reps: '20 meters', rest: '90s', note: 'Builds incredible core and leg strength.' },
            { name: 'Zercher Carries', sets: '3', reps: '20 meters', rest: '90s', note: 'Taxes the entire core and upper back.' }
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
            { name: 'Kettlebell Swings (American or Russian)', sets: '4', reps: '15-25', rest: '60s', note: 'Explosive hip hinge for glutes and hamstrings.' },
            { name: 'Renegade Rows', sets: '3', reps: '8-10 per arm', rest: '75s', note: 'Requires immense core stability.' },
            { name: 'Man-Makers', sets: '3', reps: '5-8', rest: '90s', note: 'A full body complex: push-up, row, row, clean, press.' }
        ],
        'Chest': [
            { name: 'Incline Dumbbell Press', sets: '3-4', reps: '8-12', rest: '75s', note: "Prioritize upper chest." }, 
            { name: 'Flat Dumbbell Bench Press', sets: '3-4', reps: '10-15', rest: '75s', note: "Focus on stretch and contraction." },
            { name: 'Cable Flyes (High-to-Low & Low-to-High)', sets: '3 each', reps: '12-15', rest: '60s', note: "Target different fiber angles." },
            { name: 'Machine Chest Press / Pec Deck Flyes', sets: '3', reps: '12-15 (focus on squeeze)', rest: '60s', note: "Constant tension." },
            { name: 'Push-ups (Weighted or to failure)', sets: '2-3', reps: 'AMRAP', rest: '60s', note: "Finisher."},
            { name: 'Dumbbell Squeeze Press', sets: '3', reps: '10-15', rest: '60s', note: 'Squeeze dumbbells together throughout for intense contraction.' },
            { name: 'Gironda Dips', sets: '3', reps: 'AMRAP', rest: '75s', note: 'Wide grip, flared elbows, chin to chest to target outer chest.' },
            { name: 'Svend Press', sets: '3', reps: '10-15', rest: '45s', note: 'Isometric press with plates for inner-chest focus.'}
        ], 
        'Back': [
            { name: 'Pull-ups / Assisted Pull-ups / Lat Pulldowns', sets: '3-4', reps: '8-15 (or to failure)', rest: '75s', note: "Vary grip width." }, 
            { name: 'T-Bar Rows / Chest Supported Rows', sets: '3-4', reps: '10-15', rest: '75s', note: "Focus on mid-back thickness." },
            { name: 'Single Arm Dumbbell Rows', sets: '3', reps: '10-15 per side', rest: '60s', note: "Full range of motion." },
            { name: 'Seated Cable Rows (Close Grip)', sets: '3', reps: '12-15', rest: '60s', note: "Squeeze shoulder blades together." },
            { name: 'Face Pulls (Rope Attachment)', sets: '3-4', reps: '15-20', rest: '45s', note: "Rear delts & upper back health." },
            { name: 'Straight Arm Pulldowns', sets: '3', reps: '12-15', rest: '60s', note: 'Isolates the lats with constant tension.' },
            { name: 'Meadow\'s Rows (Landmine)', sets: '3', reps: '10-12 per side', rest: '75s', note: 'Unilateral row with a unique stretch.' },
            { name: 'Rack Chins', sets: '3', reps: 'AMRAP', rest: '75s', note: 'Partial range of motion pull-ups for overloading.' }
        ], 
        'Legs': [ 
            { name: 'Barbell Squats (Moderate weight, controlled tempo)', sets: '3-4', reps: '8-12', rest: '90s', note: "Focus on form and depth." },
            { name: 'Leg Press (Various foot placements for emphasis)', sets: '3-4', reps: '12-20', rest: '75s', note: "High volume." },
            { name: 'Bulgarian Split Squats (Dumbbells)', sets: '3', reps: '10-15 per leg', rest: '60s', note: "Unilateral strength and balance." },
            { name: 'Lying Leg Curls', sets: '3-4', reps: '12-15', rest: '60s', note: "Isolate hamstrings." },
            { name: 'Leg Extensions', sets: '3-4', reps: '15-20', rest: '45-60s', note: "Quad isolation, focus on peak contraction." },
            { name: 'Glute Kickbacks (Cable or Machine)', sets: '3', reps: '15-20 per leg', rest: '45s', note: "Glute isolation."},
            { name: 'Tom Platz Hack Squats', sets: '3', reps: '10-20', rest: '90s', note: 'Deep, controlled reps for extreme quad growth.' },
            { name: 'Jefferson Squats', sets: '3', reps: '8-12', rest: '90s', note: 'Unique stance for asymmetrical loading.' },
            { name: 'Cyclist Squats (Heels Elevated)', sets: '3', reps: '15-20', rest: '60s', note: 'Maximizes quad activation.' }
        ], 
        'Shoulders': [
            { name: 'Seated Dumbbell Shoulder Press', sets: '3-4', reps: '10-15', rest: '75s', note: "Controlled, full ROM." }, 
            { name: 'Arnold Press', sets: '3-4', reps: '10-15', rest: '60s', note: "Hits all three delt heads." },
            { name: 'Lateral Raises (Dumbbell/Cable - various angles)', sets: '4-5', reps: '12-20 (consider dropsets)', rest: '45s', note: "Focus on medial delt." },
            { name: 'Front Raises (Dumbbell/Cable/Plate)', sets: '3', reps: '12-15', rest: '45s', note: "Isolate anterior delt." },
            { name: 'Bent-Over Dumbbell Raises / Reverse Pec Deck', sets: '3-4', reps: '15-20', rest: '45s', note: "Target rear delts." },
            { name: 'Lu Raises (Lateral to Front Raise)', sets: '3', reps: '10-15', rest: '60s', note: 'Combines lateral and front raise movements.' },
            { name: 'Cable Y-Raises', sets: '3', reps: '12-15', rest: '60s', note: 'Great for lower traps and shoulder health.' },
            { name: 'Egyptian Lateral Raises', sets: '3', reps: '12-15 per side', rest: '45s', note: 'Leaning lateral raise for increased stretch.' }
        ], 
        'Arms': [ 
            { name: 'Dumbbell Bicep Curls (Incline/Standing/Concentration)', sets: '3-4', reps: '10-15', rest: '60s', note: "Vary curl type for full development." }, 
            { name: 'Hammer Curls / Rope Hammer Curls', sets: '3', reps: '10-15', rest: '60s', note: "Targets brachialis and brachioradialis." },
            { name: 'Overhead Dumbbell Extension / Rope Pushdowns', sets: '3-4', reps: '12-20', rest: '60s', note: "Focus on tricep stretch and contraction." },
            { name: 'Close-Grip Push-ups / Dips (Bodyweight or Assisted)', sets: '3', reps: 'To failure or 10-15', rest: '60s', note: "Compound for triceps." },
            { name: 'Preacher Curls (Machine or EZ Bar)', sets: '3', reps: '10-12', rest: '60s', note: "Isolates bicep peak."},
            { name: 'Spider Curls', sets: '3', reps: '12-15', rest: '60s', note: 'Performed on an incline bench to isolate biceps.' },
            { name: 'Drag Curls', sets: '3', reps: '10-15', rest: '60s', note: 'Drag bar up the body, focusing on contraction.' },
            { name: 'Tate Press (Dumbbell)', sets: '3', reps: '12-15', rest: '60s', note: 'Excellent tricep isolation movement.' }
        ], 
        'Core': [
            { name: 'Cable Crunches / Machine Crunches', sets: '3-4', reps: '15-25', rest: '45s', note: "Focus on spinal flexion." }, 
            { name: 'Hanging Leg Raises / Captain\'s Chair Leg Raises', sets: '3-4', reps: '12-20 (or to failure)', rest: '60s', note: "Target lower abs." },
            { name: 'Russian Twists (Weighted if possible)', sets: '3', reps: '15-20 per side', rest: '45s', note: "Work obliques." },
            { name: 'Plank Variations (Side Plank, RKC Plank, Stability Ball Plank)', sets: '3', reps: '30-60s hold per variation', rest: '45s', note: "Build isometric strength." },
            { name: 'Back Extensions / Hyperextensions (Bodyweight or Weighted)', sets: '3', reps: '12-15', rest: '60s', note: "Strengthen lower back."},
            { name: 'Pallof Press', sets: '3', reps: '10-15 per side', rest: '60s', note: 'Anti-rotation exercise for deep core stability.' },
            { name: 'Dragon Flags', sets: '3', reps: 'AMRAP', rest: '90s', note: 'Advanced core exercise popularized by Bruce Lee.' },
            { name: 'Landmine 180s / Twists', sets: '3', reps: '10-15 per side', rest: '60s', note: 'Rotational core work with a barbell.' }
        ],
    },
    flexibility: {
        'dynamic': [
            { name: 'Arm Circles (Forward & Backward)', reps: '10-15 each direction', duration: '30s', target: ['Shoulders', 'Upper Body', 'Chest', 'Back'] },
            { name: 'Leg Swings (Forward & Sideways)', reps: '10-15 per leg/direction', duration: '30s per leg', target: ['Legs', 'Lower Body', 'Hips', 'Glutes'] },
            { name: 'Torso Twists (Standing, controlled)', reps: '10-15 each side', duration: '30s', target: ['Core', 'Back'] },
            { name: 'Cat-Cow Stretches', reps: '8-10 cycles', duration: '60s', target: ['Back', 'Core', 'Full Body'] },
            { name: 'Walking Lunges with Thoracic Rotation', reps: '5-8 per leg', duration: '60s', target: ['Full Body', 'Legs', 'Back', 'Hips', 'Quads'] },
            { name: 'High Knees / Butt Kicks (Light)', duration: '30s each', target: ['Full Body', 'Legs', 'Quads', 'Hamstrings'] },
            { name: 'World\'s Greatest Stretch', reps: '5-8 per side', duration: '90s', note: 'Opens hips, hamstrings, and thoracic spine.', target: ['Full Body', 'Hips', 'Legs', 'Back', 'Hamstrings'] },
            { name: 'Inchworms', reps: '5-8', duration: '60s', note: 'Stretches hamstrings and activates shoulders/core.', target: ['Full Body', 'Hamstrings', 'Shoulders', 'Core'] },
            { name: 'Spider-Man Lunges', reps: '8-10 per side', duration: '60s', note: 'Excellent for hip mobility.', target: ['Hips', 'Legs', 'Lower Body'] },
            { name: 'Sun Salutation A (Flow)', reps: '2-3 rounds', note: "Flow with breath.", target: ['Full Body'] },
            { name: 'Bird-Dog', reps: '8-12 per side (slow and controlled)', note: 'Improves core stability and balance.', target: ['Core', 'Back', 'Glutes'] }
        ],
        'static': [
            { name: 'Doorway Chest Stretch', duration: '30-45s hold x 2 sets', target: ['Chest', 'Shoulders', 'Upper Body'] },
            { name: 'Lat Stretch (Hanging or Side Bend)', duration: '30-45s hold per side x 2 sets', target: ['Back', 'Lats', 'Upper Body'] },
            { name: 'Seated Hamstring Stretch', duration: '30-45s hold per leg x 2 sets', target: ['Legs', 'Hamstrings', 'Lower Body'] },
            { name: 'Standing Quad Stretch', duration: '30-45s hold per leg x 2 sets', target: ['Legs', 'Quads', 'Lower Body'] },
            { name: 'Kneeling Hip Flexor Stretch', duration: '30-45s hold per leg x 2 sets', target: ['Hips', 'Legs', 'Lower Body', 'Quads'] },
            { name: 'Figure-4 Glute Stretch', duration: '30-45s hold per leg x 2 sets', target: ['Hips', 'Glutes', 'Lower Body'] },
            { name: 'Wall Calf Stretch', duration: '30-45s hold per variation/leg', target: ['Legs', 'Calves', 'Lower Body'] },
            { name: 'Couch Stretch', duration: '45-60s hold per leg', note: 'Intense stretch for quads and hip flexors.', target: ['Quads', 'Hips', 'Legs'] },
            { name: 'Pigeon Pose', duration: '45-60s hold per leg', note: 'Deep glute and piriformis stretch.', target: ['Hips', 'Glutes', 'Lower Body', 'Back'] },
            { name: 'Thread the Needle', duration: '30-45s hold per side', note: 'Stretches shoulders and upper back.', target: ['Shoulders', 'Back', 'Upper Body'] },
            { name: 'Overhead Tricep Stretch', duration: '30s hold per side', target: ['Arms', 'Triceps', 'Shoulders', 'Back'] },
            { name: 'Cross-Body Shoulder Stretch', duration: '30s hold per side', target: ['Shoulders', 'Upper Body'] },
            { name: 'Downward-Facing Dog', duration: '5-8 breaths hold', note: "Press heels down, lengthen spine.", target: ['Full Body', 'Hamstrings', 'Calves', 'Back', 'Shoulders'] },
            { name: 'Bridge Pose', duration: '5-8 breaths hold', note: "Lift hips, engage glutes.", target: ['Glutes', 'Back', 'Core', 'Hamstrings'] },
            { name: 'Reclining Spinal Twist', duration: '5-8 breaths hold per side', note: "Gentle twist, shoulders grounded.", target: ['Back', 'Core', 'Glutes', 'Hips'] },
            { name: 'Child\'s Pose (Balasana)', duration: '5-8 breaths hold', note: 'Gentle stretch for back, hips, and thighs.', target: ['Back', 'Hips', 'Full Body'] },
            { name: 'Cobra Pose (Bhujangasana)', duration: '3-5 breaths hold', note: 'Opens chest and strengthens spine.', target: ['Chest', 'Back', 'Core']}
        ]
    }
};


// --- AI Logic for Generating Weekly Plan ---
const getAdditionalExercisesFromDb = (category, subCategory, count, existingNames = []) => {
    let exercisePool = [];
    if ((category === 'strength' || category === 'hypertrophy') && Array.isArray(subCategory)) {
        subCategory.forEach(focus => {
            if (exerciseDatabase[category] && exerciseDatabase[category][focus] && Array.isArray(exerciseDatabase[category][focus])) {
                exercisePool.push(...exerciseDatabase[category][focus]);
            }
        });
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
    const uniquePool = exercisePool.filter((ex, index, self) => index === self.findIndex((e) => e.name === ex.name));

    const available = uniquePool.filter(ex => !existingNames.includes(ex.name));
    return [...available].sort(() => 0.5 - Math.random()).slice(0, count);
};


const generateWeeklyPlan = (inputs) => {
    const { sport, strengthFocus, hypertrophyFocus, runningGoal, focusBalance, trainingDays } = inputs;

    const fullRestProtocol = {
        activity: 'Full Rest',
        details: 'Objective: Maximize physical and mental recuperation. Prioritize sleep, nutrition, and stress management. This is crucial for adaptation and progress.',
        trainingProtocol: [
            { protocolStep: "Primary Focus", description: "Complete rest from structured training.", items: [{ name: 'Full Rest Day', note: 'Focus on recovery.'}] },
            { protocolStep: "Optional Light Activity", description: "If desired, very light, non-strenuous activity like a short walk or gentle stretching.", items: [{ name: 'Gentle Walk (Optional)', duration: '15-20 min'}, { name: 'Light Static Stretching (Optional)', duration: '10-15 min'}]}
        ]
    };

    const activeRecoveryProtocol = {
        activity: 'Active Recovery / Mobility',
        details: `Objective: Promote recovery or enjoy a different low-stress activity.`,
        trainingProtocol: [
            { protocolStep: "Activity Choice", description: "Choose one of the following:", items: [
                {name: 'Easy Cycling or Swimming', duration: '20-30 min (Low Intensity)', type: 'Cardio'},
                {name: 'Full Body Mobility Flow', duration: '20-25 min', type: 'Mobility'},
                {name: 'Gentle Yoga or Tai Chi', duration: '20-30 min', type: 'Flexibility/Mindfulness'}
            ]}
        ]
    };

    let plan = [ 
        { day: 'Monday', activity: 'Workout', details: '', trainingProtocol: [] },
        { day: 'Tuesday', activity: 'Workout', details: '', trainingProtocol: [] },
        { day: 'Wednesday', activity: 'Workout', details: '', trainingProtocol: [] },
        { day: 'Thursday', activity: 'Workout', details: '', trainingProtocol: [] },
        { day: 'Friday', activity: 'Workout', details: '', trainingProtocol: [] },
        { day: 'Saturday', activity: 'Workout', details: '', trainingProtocol: [] },
        { day: 'Sunday', activity: 'Workout', details: '', trainingProtocol: [] },
    ];

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let availableWorkoutDays = dayOrder.slice(0, trainingDays);
    
    // --- Start Scheduling Activities ---
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
    
    const getLiftingExercises = (type, focusAreas, numPrimary = 2, numAccessory = 3) => { 
        let exercises = [];
        if (!focusAreas || focusAreas.length === 0) focusAreas = ['Full Body'];
        const isBroadFocus = focusAreas.includes('Full Body');
        
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
    
    const totalSessions = trainingDays;
    let numRunningSessions = Math.round(trainingDays * (runningGoal ? (focusBalance < -0.3 ? 0.6 : (focusBalance > 0.3 ? 0.33 : 0.5)) : 0));
    const liftingFocusCount = (strengthFocus?.length || 0) + (hypertrophyFocus?.length || 0);
    let numLiftingSessions = liftingFocusCount > 0 ? totalSessions - numRunningSessions : 0;
    
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

    let runningDaysScheduled = 0;
    const runningDayPreferences = {
        longRun: ['Saturday', 'Sunday', 'Monday'],
        speedWork: ['Tuesday', 'Wednesday'],
        tempoOrEasy: ['Thursday', 'Friday']
    };
    let runningWarmupProtocolDesc = `Perform 10-15 minutes of easy jogging, followed by dynamic drills: leg swings (forward/backward, side-to-side), A-skips, B-skips, high knees, butt kicks, and ankle mobility exercises. Include 4-6 x 50-100m strides, building to near target pace for harder sessions.`;
    let runningCooldownProtocolDesc = `Complete 5-10 minutes of easy walking or jogging to gradually lower heart rate. Follow with 5-10 minutes of static stretching, holding each stretch for 30-45 seconds, focusing on hamstrings, quadriceps, calves, hip flexors, and glutes.`;
    
    const createRunningProtocol = (mainSetName, mainSetNote, mainSetType = 'Main Activity') => {
        const runningWarmups = [...exerciseDatabase.flexibility.dynamic].sort(() => 0.5 - Math.random()).slice(0, 4);
        const runningMuscles = ['Hamstrings', 'Quads', 'Calves', 'Glutes', 'Hips', 'Legs'];
        let runningCooldowns = exerciseDatabase.flexibility.static.filter(ex => ex.target.some(t => runningMuscles.includes(t)));
        if (runningCooldowns.length < 4) {
            runningCooldowns.push(...exerciseDatabase.flexibility.static.filter(ex => !runningCooldowns.some(s => s.name === ex.name)));
        }
        runningCooldowns = [...runningCooldowns].sort(() => 0.5 - Math.random()).slice(0, 4);

        return [
            { protocolStep: "Warm-up Protocol", description: runningWarmupProtocolDesc, items: runningWarmups.map(ex => ({...ex, type: 'Warm-up Drill'})) },
            { protocolStep: "Main Set Protocol", description: mainSetNote, items: [{ name: mainSetName, note: mainSetNote.split('\n')[0] , type: mainSetType}]}, 
            { protocolStep: "Cool-down Protocol", description: runningCooldownProtocolDesc, items: runningCooldowns.map(ex => ({...ex, type: 'Cool-down Stretch'})) }
        ];
    }
    
    if (numRunningSessions > 0) { // Long Run Day
        scheduleActivity(runningDayPreferences.longRun, availableWorkoutDays, (dayPlan) => {
            dayPlan.activity = `Endurance: Long Run`;
            dayPlan.details = `Objective: Build aerobic capacity, endurance, and mental toughness. The cornerstone of any distance plan.`;
            
            const rand = Math.random();
            if (runningGoal.includes('Marathon')) { 
                dayPlan.trainingProtocol = rand > 0.5 ?
                    createRunningProtocol('Marathon Pace Long Run', `90-120 minute run, including 2 sets of 4-5 miles at your target Marathon Pace within the run.`) :
                    createRunningProtocol('Progressive Long Run', `Your longest run of the week (e.g., 12-18 miles). Start easy and gradually increase the pace, finishing the last 2-3 miles at a comfortably hard effort.`);
            }
            else if (runningGoal.includes('Half Marathon')) {
                 dayPlan.trainingProtocol = rand > 0.5 ?
                    createRunningProtocol('Half Marathon Pace Long Run', `75-90 minute run, with the last 20-30 minutes at your target Half Marathon pace.`) :
                    createRunningProtocol('Steady Long Run', `Increase weekly distance towards 10-12 miles at an easy, conversational pace. Focus on time on feet.`);
            }
            else if (runningGoal.includes('10km')) { 
                 dayPlan.trainingProtocol = rand > 0.5 ?
                    createRunningProtocol('10k Progression Run (8-12km)', `Start at an easy pace for the first half, then gradually speed up to finish the last 2-3km at your 10k goal pace.`) :
                    createRunningProtocol('Negative Split Long Run', `Run 60-75 minutes. Aim to run the second half slightly faster than the first half.`);
            }
            else if (runningGoal.includes('5km')) {
                 dayPlan.trainingProtocol = rand > 0.5 ?
                    createRunningProtocol('Timed 5km Effort', `After a full warm-up, run a 5km time trial to gauge your current fitness and pacing.`) :
                    createRunningProtocol('3 x 1 Mile Repeats', `Run 3 repeats of 1 mile at your 5k goal pace, with 3-4 minutes of jog recovery between each.`);
            }
            else { 
                dayPlan.trainingProtocol = createRunningProtocol('Conversational Long Run', `Run for 60-90 minutes at a pace where you can comfortably hold a conversation. The goal is building your aerobic base.`);
            }
            runningDaysScheduled++;
        });
    }

    if (numRunningSessions >= 2) { // Speed/Interval Day
        scheduleActivity(runningDayPreferences.speedWork, availableWorkoutDays, (dayPlan) => {
            dayPlan.activity = `Intensity: Speed Work`;
            dayPlan.details = `Objective: Improve VO2 max, running economy, and lactate threshold for faster race times.`;

            const rand = Math.random();
            if (runningGoal.includes('Marathon')) {
                 dayPlan.trainingProtocol = rand > 0.5 ?
                    createRunningProtocol('Lactate Threshold Intervals', `3-4 repeats of 2 miles at your 10k to half-marathon pace. Take 3-4 minutes of jog recovery between intervals.`) :
                    createRunningProtocol('Yasso 800s', `8-10 repeats of 800m. The goal time for each 800m (in min:sec) should match your goal marathon time (in hr:min). Jog for an equal amount of time as recovery.`);
            }
            else if (runningGoal.includes('Half Marathon')) {
                 dayPlan.trainingProtocol = rand > 0.5 ?
                    createRunningProtocol('Cruise Intervals', `5-6 repeats of 1 mile at your 10k pace. Take a 400m jog for recovery.`) :
                    createRunningProtocol('Tempo Run', `20-30 minutes of continuous running at a comfortably hard pace (just below your lactate threshold).`);
            }
            else if (runningGoal.includes('10km')) {
                 dayPlan.trainingProtocol = rand > 0.5 ?
                    createRunningProtocol('VO2 Max Intervals', `5-6 repeats of 1000m at your 5k race pace. Take a 400-600m jog for recovery.`) :
                    createRunningProtocol('Hill Repeats', `Find a moderate hill. Run 8-10 repeats of 45-60 seconds uphill at a hard effort. Jog back down for recovery. Focus on power and form.`);
            }
            else if (runningGoal.includes('5km')) {
                 dayPlan.trainingProtocol = rand > 0.5 ?
                    createRunningProtocol('VO2 Max Intervals', `10-12 repeats of 400m at slightly faster than your 5k goal pace. Take a 400m jog for recovery.`) :
                    createRunningProtocol('Structured Fartlek', `30 min run including 8 repeats of (1 minute at 5k pace, 1 minute easy jog).`);
            }
            else { 
                dayPlan.activity = `Intensity: Fartlek/Hills`;
                dayPlan.details = `Objective: Build fitness with unstructured speed play or hill strength.`;
                dayPlan.trainingProtocol = rand > 0.5 ?
                    createRunningProtocol('Unstructured Fartlek', `Run for 30-40 minutes at an overall easy pace, but add 8-10 surges of 1-3 minutes at a faster pace. Use landmarks to guide your efforts.`) :
                    createRunningProtocol('Hill Repeats', `6-8 repeats of a 30-45 second hill sprint. Jog back down for recovery.`);
            }
            runningDaysScheduled++;
        });
    }
    
    if (numRunningSessions === 3) { // Easy/Tempo Day
         scheduleActivity(runningDayPreferences.tempoOrEasy, availableWorkoutDays, (dayPlan) => {
            dayPlan.activity = `Foundation: Easy/Tempo Run`;
            dayPlan.details = `Objective: Enhance aerobic fitness, aid recovery, and build mileage without excessive stress.`;

            const rand = Math.random();
            if (runningGoal.includes('Marathon') || runningGoal.includes('Half Marathon')) { 
                dayPlan.trainingProtocol = rand > 0.5 ?
                    createRunningProtocol('Easy Recovery Run', `45-60 minutes at a very easy, conversational pace. This run is all about recovery and building mileage.`) :
                    createRunningProtocol('Progression Run', `Start a 45-minute run at an easy pace, gradually increasing your speed every 15 minutes, finishing at a comfortably hard tempo.`);
            }
            else if (runningGoal.includes('10km') || runningGoal.includes('5km')) {
                 dayPlan.trainingProtocol = rand > 0.5 ?
                    createRunningProtocol('Easy Run with Strides', `30-40 minutes at an easy pace. Finish with 4-6 repeats of 100m strides (fast but not sprinting) to work on turnover.`) :
                    createRunningProtocol('Recovery Jog', `A short, 20-30 minute run at a very slow, relaxed pace to promote blood flow and recovery.`);
            }
            else { 
                dayPlan.trainingProtocol = createRunningProtocol('Easy Foundational Run', `Run for 30-50 minutes at an easy, conversational pace to build your aerobic base.`);
            }
            runningDaysScheduled++;
        });
    }
    
    const getTargetedFlexibility = (focuses, flexType, count) => {
        const allFlexExercises = exerciseDatabase.flexibility[flexType];
        
        const detailedFocuses = new Set(focuses);
        if(detailedFocuses.has('Upper Body')) { ['Chest', 'Back', 'Shoulders', 'Arms'].forEach(f => detailedFocuses.add(f)); }
        if(detailedFocuses.has('Lower Body')) { ['Legs', 'Glutes', 'Hamstrings', 'Quads', 'Calves', 'Hips'].forEach(f => detailedFocuses.add(f)); }
        if(detailedFocuses.has('Legs')) { ['Glutes', 'Hamstrings', 'Quads', 'Calves', 'Hips'].forEach(f => detailedFocuses.add(f)); }

        let targetedExercises = allFlexExercises.filter(ex => 
            detailedFocuses.size > 0 && ex.target.some(t => detailedFocuses.has(t))
        );
        
        const fullBodyExercises = allFlexExercises.filter(ex => ex.target.includes('Full Body'));
        targetedExercises.push(...fullBodyExercises);

        targetedExercises = targetedExercises.filter((ex, index, self) => index === self.findIndex((e) => e.name === ex.name));

        if (targetedExercises.length < count) {
            const remainingExercises = allFlexExercises.filter(ex => !targetedExercises.some(tEx => tEx.name === ex.name));
            targetedExercises.push(...remainingExercises);
        }
        
        return [...targetedExercises].sort(() => 0.5 - Math.random()).slice(0, count);
    }

    const assignLiftingSession = (type, focusList, dayPlan) => { 
        const isBroadCategory = focusList.some(f => ['Full Body'].includes(f));
        let sessionTitleFocus = focusList.join(' & ');
        if (isBroadCategory) {
            sessionTitleFocus = focusList.find(f => ['Full Body'].includes(f)) || focusList.join(' & ');
        } else if (focusList.length > 2) { 
            sessionTitleFocus = `${focusList.slice(0,2).join(' & ')} & More`;
        }
        const numPrimary = type === 'strength' ? (isBroadCategory ? 2 : (focusList.length > 1 ? 1 : 2) ) : (isBroadCategory ? 3 : (focusList.length > 1 ? 2: 3)); 
        const numAccessory = type === 'strength' ? (isBroadCategory ? 3 : (focusList.length > 1 ? 3 : 2)) : (isBroadCategory ? 4 : 3);
        dayPlan.activity = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${sessionTitleFocus}`;
        dayPlan.details = `Objective: ${type === 'strength' ? `Increase maximal strength in ${focusList.join(', ')}.` : `Stimulate muscle growth (hypertrophy) in ${focusList.join(', ')}.`}`;
        
        const targetedWarmup = getTargetedFlexibility(focusList, 'dynamic', 3);
        const targetedCooldown = getTargetedFlexibility(focusList, 'static', 3);

        let warmupDesc = `5-10 min light cardio (e.g., bike, rower). Follow with dynamic mobility drills specifically targeting the muscles for today's session: ${focusList.join(', ')}. Include specific warm-up sets for the primary lifts, gradually increasing the weight.`;
        let mainWorkoutDesc = `Execute ${numPrimary} primary ${type === 'strength' ? 'compound lifts' : 'exercises'} followed by ${numAccessory} accessory/isolation movements targeting ${focusList.join(', ')}. \n${type === 'strength' ? 'Execution Focus: Utilize heavy weight, aiming for low to moderate repetitions (typically 3-8 reps). Ensure full rest periods (2-5 minutes) between sets to maximize recovery and force output. Focus on explosive concentric (lifting) phases and controlled eccentric (lowering) phases. Aim to progressively overload by increasing weight or reps weekly.' : 'Execution Focus: Use moderate weight with moderate-to-high repetitions (typically 8-15 reps, sometimes up to 20 for isolation). Maintain a controlled tempo (e.g., 2-second eccentric, 0-1 second pause, 1-second concentric) to maximize time under tension. Implement shorter rest periods (60-90 seconds) to accumulate metabolic stress and induce a muscle pump.'}`;
        let cooldownDesc = `5-10 min of static stretching focusing on the muscles worked today (${focusList.join(', ')}). Holding each stretch will help improve flexibility and aid recovery.`;
        
        dayPlan.trainingProtocol = [
            { protocolStep: "Warm-up Protocol", description: warmupDesc, items: targetedWarmup.map(ex => ({ ...ex, type: 'Warm-up Drill' })) },
            { protocolStep: "Main Workout Protocol", description: mainWorkoutDesc, items: getLiftingExercises(type, focusList, numPrimary, numAccessory).map(ex => ({ ...ex, type: 'Main Lift' })) },
            { protocolStep: "Cool-down Protocol", description: cooldownDesc, items: targetedCooldown.map(ex => ({ ...ex, type: 'Cool-down Stretch' })) }
        ];
    };

    // --- NEW LIFTING SPLIT LOGIC ---
    const scheduleLiftingDays = (type, focusPool, numSessions) => {
        if (numSessions === 0 || !focusPool || focusPool.length === 0) return;

        let dayAssignments = [];
        let tempPool = [...focusPool];

        // If 'Full Body' is explicitly chosen, all sessions of this type are 'Full Body'
        if (tempPool.includes('Full Body')) {
            dayAssignments = Array(numSessions).fill(['Full Body']);
        } else {
            const pairings = {
                'Chest': ['Shoulders', 'Arms'],
                'Back': ['Arms'],
                'Shoulders': ['Chest', 'Arms'],
                'Legs': ['Core'],
                'Core': ['Legs'],
                'Arms': ['Chest', 'Back', 'Shoulders'],
            };
            const assignedFocuses = new Set();
            
            // Prioritize creating logical groups based on the number of sessions
            if (numSessions >= tempPool.length) {
                // If enough days, each focus gets its own day
                dayAssignments = tempPool.map(focus => [focus]);
            } else {
                // Not enough days, so we must group muscles
                const groupOrder = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
                const sortedPool = tempPool.sort((a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b));

                while (assignedFocuses.size < sortedPool.length) {
                    if (dayAssignments.length >= numSessions) break;

                    const currentFocus = sortedPool.find(f => !assignedFocuses.has(f));
                    if (!currentFocus) break;

                    const newGroup = [currentFocus];
                    assignedFocuses.add(currentFocus);

                    // Find a partner
                    if (pairings[currentFocus]) {
                        for (const partner of pairings[currentFocus]) {
                            if (sortedPool.includes(partner) && !assignedFocuses.has(partner)) {
                                newGroup.push(partner);
                                assignedFocuses.add(partner);
                                break; // Take the first logical partner
                            }
                        }
                    }
                    dayAssignments.push(newGroup);
                }
                
                // Distribute any remaining unassigned focuses into existing groups
                let groupIndex = 0;
                for(const focus of sortedPool) {
                    if(!assignedFocuses.has(focus)) {
                        dayAssignments[groupIndex % dayAssignments.length].push(focus);
                        groupIndex++;
                    }
                }
            }
        }
        
        // Fill any remaining lifting days with Full Body workouts
        while (dayAssignments.length < numSessions) {
            dayAssignments.push(['Full Body']);
        }

        // Schedule the generated lifting days
        dayAssignments.forEach((focusGroup, i) => {
            if (availableWorkoutDays.length === 0) return;
            const preferredDays = (i % 2 === 0) ? ['Monday', 'Wednesday', 'Friday', 'Tuesday'] : ['Tuesday', 'Thursday', 'Saturday', 'Monday'];
            scheduleActivity(preferredDays, availableWorkoutDays, (dayPlan) => {
                assignLiftingSession(type, focusGroup, dayPlan);
            });
        });
    };

    scheduleLiftingDays('strength', strengthFocus, numStrengthSessions);
    scheduleLiftingDays('hypertrophy', hypertrophyFocus, numHypertrophySessions);
    
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
                    sportSkillItems = [ { name: 'Dribbling Drills (Cones, Agility)', duration: '10 min'}, { name: 'Passing & Receiving Drills (Short & Long)', duration: '10 min'}, { name: 'Shooting Practice (Stationary & Moving Ball)', duration: '10 min'} ];
                    sportConditioningItems = [ { name: 'Agility Ladder & Cone Drills', sets: '3-4', reps: 'various patterns', rest: '60s'}, { name: 'Repeated Sprint Ability (e.g., 6x30m sprints, 30s rest)', sets: '2-3', reps: '6 sprints'} ];
                } else if (sport.toLowerCase().includes('basketball')) {
                     sportSkillItems = [ { name: 'Ball Handling Drills (Stationary & Moving)', duration: '10 min'}, { name: 'Shooting Form & Practice (Free Throws, Jump Shots)', duration: '15 min'}, { name: 'Layup & Finishing Drills', duration: '10 min'} ];
                     sportConditioningItems = [ { name: 'Defensive Slide Drills (Cone to Cone)', sets: '3-4', reps: '30-45s', rest: '60s'}, { name: 'Suicide Sprints / Shuttle Runs', sets: '3-5', reps: 'Full court'} ];
                } else if (sport.toLowerCase().includes('combat')) { 
                    sportSkillItems = [ { name: 'Shadow Boxing / Movement Drills', duration: '10-15 min'}, { name: 'Heavy Bag Work (Combinations, Power)', sets:'3-5', reps:'2-3 min rounds'}, { name: 'Partner Drills / Light Sparring (If applicable)', duration: '10-15 min'} ];
                     sportConditioningItems = [ { name: 'High-Intensity Interval Rounds (e.g., Assault Bike, Burpees, Slams)', sets: '3-5', reps: '3 min on, 1 min off'} ];
                } else { 
                     sportSkillItems = [{ name: `${sport} Specific Drills`, duration: '20-30 min' }];
                     sportConditioningItems = [{ name: `${sport} Conditioning`, duration: '15-20 min' }];
                }
                const sportWarmups = getTargetedFlexibility(['Full Body'], 'dynamic', 4);
                const sportCooldowns = getTargetedFlexibility(['Full Body'], 'static', 4);

                dayPlan.trainingProtocol = [
                    { protocolStep: "Warm-up Protocol", description: sportWarmupDesc, items: sportWarmups.map(item => ({...item, type: 'Warm-up'})) },
                    { protocolStep: "Skill Development Protocol", description: `Focus on refining key techniques and tactical understanding for ${sport}.`, items: sportSkillItems.map(item => ({...item, type: 'Skill'})) },
                    { protocolStep: "Conditioning Protocol", description: `Build endurance, speed, and power specific to the demands of ${sport}.`, items: sportConditioningItems.map(item => ({...item, type: 'Conditioning'})) },
                    { protocolStep: "Cool-down Protocol", description: sportCooldownDesc, items: sportCooldowns.map(item => ({...item, type: 'Cool-down'})) }
                ];
                sportSessionsCount++;
            });
        }
    }

    // --- NEW LOGIC FOR ASSIGNING REST AND RECOVERY DAYS ---
    let activeRecoveryDayAssigned = false;
    dayOrder.forEach(day => {
        const dayPlan = plan.find(p => p.day === day);
        // If a day is still marked as 'Workout', it's an unassigned day.
        if (dayPlan.activity === 'Workout') { 
            // Prefer Sunday as the primary full rest day
            if (day === 'Sunday') {
                 Object.assign(dayPlan, fullRestProtocol);
            } 
            // Assign the first available non-training day as Active Recovery
            else if (!activeRecoveryDayAssigned) {
                Object.assign(dayPlan, activeRecoveryProtocol);
                activeRecoveryDayAssigned = true;
            } 
            // All other unassigned days become Full Rest
            else {
                 Object.assign(dayPlan, fullRestProtocol);
            }
        }
    });

    return plan;
};


// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savedPlans, setSavedPlans] = useState([]);
  const [theme, setTheme] = useState('dark');

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
  }, [theme]);


  const navigateTo = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); 
    window.scrollTo(0, 0); 
  };

  const addSavedPlan = (planToSave, inputs) => {
    const newSavedPlan = {
        id: `plan-${Date.now()}`, 
        name: `Plan for ${inputs.sport || 'General Fitness'} (${new Date().toLocaleDateString()})`,
        inputs: {...inputs}, 
        plan: planToSave, 
        dateSaved: new Date().toISOString()
    };
    setSavedPlans(prevPlans => [newSavedPlan, ...prevPlans]);
    // Replace alert with a more modern notification if possible, but for now it works.
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
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-200'}`}>
      <Navbar navigateTo={navigateTo} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} theme={theme} toggleTheme={toggleTheme} currentPage={currentPage} />
      <main className="flex-grow container mx-auto px-4 py-8 pt-20 md:pt-24">
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
  const logoBaseTextColor = theme === 'light' ? 'text-slate-800' : 'text-slate-100';
  const logoAccentColor = 'text-orange-500 dark:text-orange-400';
  const navBgColor = theme === 'light' ? 'bg-white/80' : 'bg-slate-950/80'; 

  return (
    <nav className={`${navBgColor} backdrop-blur-lg fixed w-full z-50 top-0 border-b border-slate-200/50 dark:border-slate-800/50`}> 
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16"> 
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigateTo('home')}
          >
            <Dumbbell size={30} className={`${logoAccentColor} group-hover:rotate-[-15deg] transition-transform duration-300 ease-in-out`} />
            <span className={`text-xl md:text-2xl font-bold tracking-tight`}>
                <span className={`${logoAccentColor}`}>Bans</span>
                <span className={`${logoBaseTextColor}`}>thetics</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1"> 
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => navigateTo(item.page)}
                className={`flex items-center space-x-2 transition-colors px-3 py-2 rounded-lg text-sm font-semibold group
                            ${currentPage === item.page 
                                ? `${activeTextColor} bg-orange-500/10` 
                                : `${baseTextColor} ${hoverTextColor} hover:bg-slate-500/10`
                            }
                           `} 
              >
                {React.cloneElement(item.icon, { className: `transition-colors`})}
                <span>{item.label}</span>
              </button>
            ))}
             <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-lg ${baseTextColor} ${hoverTextColor} hover:bg-slate-500/10 transition-colors ml-2`}
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          <div className="md:hidden flex items-center">
             <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-full ${baseTextColor} ${hoverTextColor} hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors mr-1`}
            >
                {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${baseTextColor} ${hoverTextColor} focus:outline-none p-2 rounded-md`}
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`md:hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-900'} absolute w-full left-0 top-16 shadow-lg`}> 
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => navigateTo(item.page)}
                className={`w-full flex items-center space-x-3 transition-colors px-3 py-3 rounded-md text-base font-medium group
                            ${currentPage === item.page 
                                ? `${activeTextColor} ${theme === 'light' ? 'bg-orange-50' : 'bg-orange-500/10'}` 
                                : `${baseTextColor} ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} ${hoverTextColor}`
                            }
                `} 
              >
                {React.cloneElement(item.icon, { size: 20 })}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const ToggleSwitch = ({ enabled, setEnabled }) => {
    return (
        <button
            type="button"
            className={`${
                enabled ? 'bg-orange-500 dark:bg-orange-600' : 'bg-slate-300 dark:bg-slate-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:ring-offset-slate-900`}
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
      includeHypertrophy: true,
  });
  
  const [selectedSport, setSelectedSport] = useState(categorizedSportsOptions[1]?.options[0] || ""); 
  const [strengthFocus, setStrengthFocus] = useState([]); 
  const [hypertrophyFocus, setHypertrophyFocus] = useState([]); 
  const [selectedRunningGoal, setSelectedRunningGoal] = useState(runningGoalOptions[0]);
  const [focusBalance, setFocusBalance] = useState(0); 
  const [trainingDays, setTrainingDays] = useState(5);
  
  const [currentInputs, setCurrentInputs] = useState(null); 
  const [generatedWeeklyPlan, setGeneratedWeeklyPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = (pref) => {
      setPreferences(prev => {
          const newState = {...prev, [pref]: !prev[pref]};
          if (pref === 'includeSport' && !newState.includeSport) setSelectedSport('');
          if (pref === 'includeStrength' && !newState.includeStrength) setStrengthFocus([]);
          if (pref === 'includeHypertrophy' && !newState.includeHypertrophy) setHypertrophyFocus([]);
          if (pref === 'includeRunning' && !newState.includeRunning) setSelectedRunningGoal('');
          return newState;
      });
  };

  const handleMultiSelectChange = (setter, currentValue, option) => {
    setter(currentValue.includes(option) ? currentValue.filter(item => item !== option) : [...currentValue, option]);
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
      try {
        const plan = generateWeeklyPlan(inputsForPlan);
        setGeneratedWeeklyPlan(plan);
      } catch (e) {
        setError("An error occurred while generating the plan. Please check your inputs and try again.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 1500); 
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

    const newPlan = JSON.parse(JSON.stringify(generatedWeeklyPlan));
    const dayIndex = newPlan.findIndex(d => d.day === day);
    if (dayIndex === -1) return;

    const protocolIndex = newPlan[dayIndex].trainingProtocol.findIndex(p => p.protocolStep === protocolStepName);
    if (protocolIndex === -1) return;

    const currentProtocolStep = newPlan[dayIndex].trainingProtocol[protocolIndex];
    const existingExerciseNames = currentProtocolStep.items.map(item => item.name);
    
    let exerciseCategory = '';
    let exerciseSubCategory = [];

    if (protocolStepName.toLowerCase().includes('warm-up')) {
        exerciseCategory = 'flexibility';
        exerciseSubCategory = 'dynamic';
    } else if (protocolStepName.toLowerCase().includes('cool-down')) {
        exerciseCategory = 'flexibility';
        exerciseSubCategory = 'static';
    } else if (protocolStepName.toLowerCase().includes('main workout')) {
        const activityTitle = newPlan[dayIndex].activity.toLowerCase();
        if (activityTitle.includes('strength')) {
            exerciseCategory = 'strength';
            exerciseSubCategory = currentInputs.strengthFocus; 
        } else if (activityTitle.includes('hypertrophy')) {
            exerciseCategory = 'hypertrophy';
            exerciseSubCategory = currentInputs.hypertrophyFocus; 
        }
        const activityTitleFocuses = newPlan[dayIndex].activity.split(': ')[1];
        if (activityTitleFocuses) {
          const focuses = activityTitleFocuses.split(' & ').map(s => s.replace(' Focus', '').trim());
          if (focuses.length > 0 && !focuses.some(f => ['Full Body', 'Upper Body', 'Lower Body'].includes(f))) {
            exerciseSubCategory = focuses;
          }
        }
    }

    if (exerciseCategory && exerciseSubCategory.length > 0) {
        const additionalExercises = getAdditionalExercisesFromDb(exerciseCategory, exerciseSubCategory, 2, existingExerciseNames);
        if (additionalExercises.length > 0) {
            currentProtocolStep.items.push(...additionalExercises.map(ex => ({...ex, type: 'Additional'})));
        } else {
            if (!currentProtocolStep.items.find(item => item.name.includes("No more unique"))) {
                 currentProtocolStep.items.push({ name: "No more unique exercises found.", type: "Info" });
            }
        }
        setGeneratedWeeklyPlan(newPlan);
    }
};

  const inputStyles = "w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 py-2.5 px-3 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 outline-none transition";
  const sectionTitleStyles = "text-base font-semibold text-slate-800 dark:text-slate-100";

  return (
    <div className="py-6 sm:py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight flex items-center justify-center dark:text-slate-100 text-slate-900">
          <Brain size={48} className="mr-3 text-orange-500 dark:text-orange-400" />
          AI Hybrid Routine Builder
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Craft a balanced weekly training plan tailored to your hybrid fitness goals.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="space-y-6"> 
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
             <label htmlFor="trainingDays" className={`${sectionTitleStyles} mb-2 block`}>How many days a week will you train?</label>
            <select id="trainingDays" value={trainingDays} onChange={(e) => setTrainingDays(parseInt(e.target.value, 10))} className={inputStyles}>
                {[1, 2, 3, 4, 5, 6, 7].map(day => <option key={day} value={day}>{day} Day{day > 1 ? 's' : ''}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                    <label className={sectionTitleStyles}>Primary Sport</label>
                    <ToggleSwitch enabled={preferences.includeSport} setEnabled={() => handleToggle('includeSport')} />
                </div>
                {preferences.includeSport && (
                    <select id="sport" value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} className={inputStyles}>
                      {categorizedSportsOptions.map(categoryGroup => (
                        categoryGroup.options[0] === "" ? <option key={categoryGroup.category} value="">{categoryGroup.category}</option> :
                        <optgroup key={categoryGroup.category} label={categoryGroup.category}>
                          {categoryGroup.options.map(sport => (<option key={sport} value={sport}>{sport}</option>))}
                        </optgroup>
                      ))}
                    </select>
                )}
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                    <label className={sectionTitleStyles}>Running Goal</label>
                    <ToggleSwitch enabled={preferences.includeRunning} setEnabled={() => handleToggle('includeRunning')} />
                </div>
                {preferences.includeRunning && (<select id="runningGoal" value={selectedRunningGoal} onChange={(e) => setSelectedRunningGoal(e.target.value)} className={inputStyles}>
                      {runningGoalOptions.map(goal => <option key={goal} value={goal}>{goal}</option>)}
                    </select>)}
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                  <label className={sectionTitleStyles}>Muscle Groups for Strength</label>
                  <ToggleSwitch enabled={preferences.includeStrength} setEnabled={() => handleToggle('includeStrength')} />
              </div>
              {preferences.includeStrength && (
                <>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Select the muscle groups you want to train for pure strength (lower reps, heavier weight).</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {muscleGroupOptions.map(group => (
                        <button key={group} onClick={() => handleMultiSelectChange(setStrengthFocus, strengthFocus, group)}
                          className={`py-2 px-2.5 rounded-md text-sm font-medium transition-all duration-150 w-full border
                            ${strengthFocus.includes(group) ? 'bg-orange-500 border-orange-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 text-slate-700 dark:text-slate-200'}`}>
                          {group}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                  <label className={sectionTitleStyles}>Muscle Groups for Hypertrophy (Size)</label>
                  <ToggleSwitch enabled={preferences.includeHypertrophy} setEnabled={() => handleToggle('includeHypertrophy')} />
              </div>
              {preferences.includeHypertrophy && (
                <>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Select the muscle groups you want to train for muscle growth (higher reps, moderate weight).</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {muscleGroupOptions.map(group => (
                        <button key={group} onClick={() => handleMultiSelectChange(setHypertrophyFocus, hypertrophyFocus, group)}
                          className={`py-2 px-2.5 rounded-md text-sm font-medium transition-all duration-150 w-full border
                            ${hypertrophyFocus.includes(group) ? 'bg-orange-500 border-orange-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 text-slate-700 dark:text-slate-200'}`}>
                          {group}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {(preferences.includeRunning && (preferences.includeStrength || preferences.includeHypertrophy)) && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <label htmlFor="focusBalance" className={`${sectionTitleStyles} mb-2 flex items-center`}>
                    <SlidersHorizontal size={18} className="mr-2 text-orange-500 dark:text-orange-400"/> Training Focus Balance: <span className="ml-2 font-normal text-orange-500 dark:text-orange-400">{getSliderLabel()}</span>
                </label>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Running</span>
                    <input type="range" id="focusBalance" min="-1" max="1" step="0.1" value={focusBalance} onChange={(e) => setFocusBalance(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500 dark:accent-orange-400"/>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Lifting</span>
                </div>
            </div>
        )}
        
        {error && <p className="text-red-500 dark:text-red-400 text-center mt-4">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button onClick={handleGeneratePlan} disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-green-500 dark:disabled:hover:bg-green-600">
              {isLoading ? (<><Loader2 size={20} className="animate-spin mr-2" />Building Your Plan...</>) : (<><Sparkles size={20} className="mr-2" />Generate My Weekly Plan</>)}
            </button>
            {generatedWeeklyPlan && !isLoading && (
                 <button onClick={handleSavePlan} className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-base shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 flex items-center justify-center">
                    <Save size={20} className="mr-2" />Save This Plan
                </button>
            )}
        </div>
      </div>

      {(!isLoading && generatedWeeklyPlan) && (
        <div className="mt-12">
          <h2 className="text-3xl font-extrabold text-center mb-8 tracking-tight text-slate-900 dark:text-slate-100">
            Your AI-Generated Weekly Hybrid Plan
          </h2>
          <div className="space-y-6"> 
            {generatedWeeklyPlan.map((dayPlan) => (
              <DayCard key={dayPlan.day} dayPlan={dayPlan} handleGenerateMoreExercises={handleGenerateMoreExercises} currentInputs={currentInputs} />
            ))}
          </div>
           <p className="text-center mt-8 text-slate-600 dark:text-slate-400 text-xs max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> This is an AI-generated sample plan. Adjust intensity, volume, and exercises based on your experience and how you feel. Prioritize proper form and consult a professional if needed.
          </p>
        </div>
      )}
      
      {(!isLoading && !generatedWeeklyPlan && !error && !isLoading) && ( 
         <div className="mt-12 text-center p-8 bg-white dark:bg-slate-800/50 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            <CalendarDays size={40} className="mx-auto text-orange-500 dark:text-orange-400 mb-3" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">Ready to Build Your Plan?</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Select your preferences above and let our AI craft a tailored hybrid training schedule for you.
            </p>
         </div>
      )}
    </div>
  );
};

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
                 <button onClick={() => {setViewingPlan(null); setTempCurrentInputs(null);}}
                    className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                    <ChevronLeft size={20} className="mr-2" />
                    Back to Saved Plans
                </button>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">{viewingPlan.name}</h2>
                <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm text-slate-600 dark:text-slate-400">
                    <p className="font-semibold">Original Inputs:</p>
                    <p>Sport: <span className="font-normal">{viewingPlan.inputs.sport || 'None'}</span></p>
                    <p>Running Goal: <span className="font-normal">{viewingPlan.inputs.runningGoal || 'None'}</span></p>
                    <p>Strength Focus: <span className="font-normal">{viewingPlan.inputs.strengthFocus?.join(', ') || 'None'}</span></p>
                    <p>Hypertrophy Focus: <span className="font-normal">{viewingPlan.inputs.hypertrophyFocus?.join(', ') || 'None'}</span></p>
                </div>
                <div className="space-y-6">
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
                <div className="text-center p-8 bg-white dark:bg-slate-800/50 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
                    <Save size={40} className="mx-auto text-orange-500 dark:text-orange-400 mb-3" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">No Saved Plans Yet</h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                        Once you generate a plan you like, save it to find it here later.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedPlans.map(plan => (
                        <div key={plan.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-lg hover:shadow-orange-500/20 dark:hover:shadow-orange-400/20 border border-slate-200 dark:border-slate-800 transition-shadow flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-orange-500 dark:text-orange-400 mb-2 truncate">{plan.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sport: <span className="font-normal">{plan.inputs.sport || 'N/A'}</span></p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Saved: {new Date(plan.dateSaved).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <button onClick={() => handleViewPlan(plan)}
                                    className="flex-1 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors">
                                    View
                                </button>
                                <button onClick={() => deleteSavedPlan(plan.id)}
                                    className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors">
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const FeedbackPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedbackType, setFeedbackType] = useState('general');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const inputStyles = "mt-1 block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 sm:text-sm text-slate-900 dark:text-slate-100 transition";

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
            <div className="max-w-md mx-auto text-center py-12">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">Thank You!</h2>
                <p className="text-slate-600 dark:text-slate-400">Your feedback has been received. We appreciate you taking the time to help us improve.</p>
            </div>
        )
    }

    return (
        <div className="max-w-lg mx-auto">
            <h2 className="text-4xl font-extrabold mb-8 text-center tracking-tight text-slate-900 dark:text-slate-100">Provide Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name (Optional)</label>
                        <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email (Optional)</label>
                        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} />
                    </div>
                </div>
                <div>
                    <label htmlFor="feedbackType" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Feedback Type</label>
                    <select id="feedbackType" name="feedbackType" value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)} className={inputStyles}>
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
                            <Star key={star} size={28} className={`cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600 hover:text-yellow-300'}`}
                                onClick={() => setRating(star)} />
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                    <textarea id="message" name="message" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} required className={inputStyles}></textarea>
                </div>
                <div>
                    <button type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-orange-500 transition-colors">
                        Submit Feedback
                    </button>
                </div>
            </form>
        </div>
    );
};


const DayCard = ({ dayPlan, handleGenerateMoreExercises, currentInputs }) => {
    const [isExpanded, setIsExpanded] = useState(true); 
    const [sessionExplanation, setSessionExplanation] = useState({ text: '', isLoading: false, error: '' });
    const [exerciseDetails, setExerciseDetails] = useState({});
    const [exerciseDetailLoading, setExerciseDetailLoading] = useState({});

    // This is a placeholder for a real API call.
    const fetchApiData = async (prompt) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(prompt.includes("explain how this specific workout")){
                    resolve(`This "${dayPlan.activity}" session is designed to directly support your goals by... [AI generated explanation text about synergy between running and lifting for the specified goals would appear here]`);
                } else if(prompt.includes("Explain the exercise")){
                     resolve(`This is a brief AI-generated explanation for the selected exercise, covering benefits and common mistakes. [Details for ${prompt.split('"')[1]} would appear here]`);
                } else {
                    reject(new Error("Unknown prompt type"));
                }
            }, 800);
        });
    };
    
    const handleExplainSession = async () => {
        if(sessionExplanation.text) {
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
            setSessionExplanation({ text: '', isLoading: false, error: 'Failed to load explanation. Please try again.' });
        }
    };


    const fetchExerciseDetail = async (exerciseName) => {
        if (exerciseDetails[exerciseName] && exerciseDetails[exerciseName].text) {
            setExerciseDetails(prev => ({ ...prev, [exerciseName]: { ...prev[exerciseName], isVisible: !prev[exerciseName].isVisible }}));
            return;
        }

        setExerciseDetailLoading(prev => ({ ...prev, [exerciseName]: true }));
        const prompt = `Explain the exercise "${exerciseName}". Briefly cover its primary benefits, 1-2 common mistakes to avoid, and how it contributes to general fitness or the specific training goal if implied (e.g. strength, hypertrophy). Keep it concise (around 50-70 words) and easy to understand.`;
        
        try {
            const text = await fetchApiData(prompt);
            setExerciseDetails(prev => ({ ...prev, [exerciseName]: { text: text.trim(), error: '', isVisible: true } }));
        } catch (error) {
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
        if (lowerActivity.includes('mobility') || lowerActivity.includes('yoga')) return <StretchHorizontal className="text-green-500 dark:text-green-400" />;
        if (lowerActivity.includes('rest')) return <Moon className="text-purple-500 dark:text-purple-400" />;
        if (lowerActivity.includes('sport') || ['soccer', 'basketball', 'combat'].some(s => lowerActivity.includes(s))) return <ShieldCheck className="text-red-500 dark:text-red-400" />;
        return <Dumbbell className="text-slate-500 dark:text-slate-400" />;
    };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden"> 
      <div className="p-5"> 
        <div className="flex items-start justify-between mb-3"> 
          <div>
            <h3 className="text-2xl font-bold text-orange-500 dark:text-orange-400">{dayPlan.day}</h3> 
             <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-1">{dayPlan.activity}</h4> 
          </div>
          <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full shadow-inner"> 
            {React.cloneElement(getIconForActivity(dayPlan.activity), {size: 24})} 
          </div>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 whitespace-pre-line">{dayPlan.details}</p> 

        { !dayPlan.activity.toLowerCase().includes('rest') && currentInputs &&
            <div className="mb-4">
                <button onClick={handleExplainSession} disabled={sessionExplanation.isLoading} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 transition">
                    {sessionExplanation.isLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : <HelpCircle size={16} className="mr-2" />}
                    Explain Session
                </button>
                {sessionExplanation.text && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 text-sm text-blue-800 dark:text-blue-200 relative">
                        <p>{sessionExplanation.text}</p>
                         <button onClick={() => setSessionExplanation({text: '', isLoading: false, error: ''})} className="absolute top-1 right-1 p-1 rounded-full hover:bg-blue-200/50 dark:hover:bg-blue-700/50 text-blue-500 dark:text-blue-400">
                             <X size={14}/>
                        </button>
                    </div>
                )}
                 {sessionExplanation.error && <p className="mt-2 text-xs text-red-500 dark:text-red-400">{sessionExplanation.error}</p>}
            </div>
        }
      </div>
        
      <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full text-left text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
              <span>Training Protocol</span>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {isExpanded && dayPlan.trainingProtocol && dayPlan.trainingProtocol.length > 0 && (
              <div className="mt-4 space-y-4">
                  {dayPlan.trainingProtocol.map((protocol, protocolIndex) => (
                      <div key={protocolIndex}>
                          <div className="flex justify-between items-center mb-1">
                              <h5 className="text-sm font-semibold text-orange-500 dark:text-orange-400">{protocol.protocolStep}</h5>
                              { protocol.protocolStep.toLowerCase().includes('main workout') && handleGenerateMoreExercises && currentInputs && 
                                  <button onClick={() => handleGenerateMoreExercises(dayPlan.day, protocol.protocolStep)} className="text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center" title="Generate more exercises">
                                      <RefreshCw size={12} className="mr-1"/> More
                                  </button>
                              }
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-xs mb-2 whitespace-pre-line">{protocol.description}</p>
                          {protocol.items && protocol.items.length > 0 && (
                              <ul className="space-y-2 text-sm"> 
                                  {protocol.items.map((ex, index) => (
                                      <li key={index} className="p-2.5 bg-white dark:bg-slate-700/40 rounded-lg shadow-sm"> 
                                          <div className="flex justify-between items-center">
                                              <span className="font-medium text-slate-800 dark:text-slate-100 text-sm">{ex.name}</span>
                                              <div className="flex items-center space-x-2">
                                                  {ex.type && <span className="text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider">{ex.type}</span>}
                                                  {ex.name !== "No more unique exercises found." && 
                                                      <button onClick={() => fetchExerciseDetail(ex.name)} title={`Info for ${ex.name}`} className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">
                                                          {exerciseDetailLoading[ex.name] ? <Loader2 size={16} className="animate-spin"/> : <Info size={16}/>}
                                                      </button>
                                                  }
                                              </div>
                                          </div>
                                          {(ex.sets || ex.duration || ex.details) && (<p className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs">
                                                  {ex.sets && ex.reps && `${ex.sets} sets of ${ex.reps} reps`}
                                                  {ex.duration && `${ex.duration}`}
                                                  {ex.rest && <span className="ml-2">({ex.rest})</span>}
                                              </p>)}
                                          {ex.note && <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-0.5">({ex.note})</p>}
                                          {exerciseDetails[ex.name]?.isVisible && (<div className="mt-2 p-2 text-xs bg-slate-100 dark:bg-slate-800 rounded">
                                                  {exerciseDetails[ex.name].error ? <p className="text-red-500 dark:text-red-400">{exerciseDetails[ex.name].error}</p> : 
                                                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{exerciseDetails[ex.name].text}</p>}
                                          </div>)}
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
  );
};

const Footer = () => {
  return (
    <footer className="bg-transparent py-6 text-center mt-8">
      <p className="text-slate-500 dark:text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Bansthetics. All Rights Reserved.
      </p>
      <p className="text-slate-400 dark:text-slate-600 text-xs mt-1">
        Engineered by BAnsMax
      </p>
    </footer>
  );
};

const CheckCircle = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);


export default App;
