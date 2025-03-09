def generate_progress_report(user_data, progress_data):
    # Extract user details
    user_name = user_data.get("fullName")
    target_language = user_data.get("targetLanguage")
    prior_experience = user_data.get("priorExperience")  # User's language proficiency level

    # Extract progress details
    xp = progress_data.get("xp")
    level = progress_data.get("level")
    tier = progress_data.get("tier" )
    lessons_completed = progress_data.get("lessonsCompleted")
    xp_required_for_next_level = progress_data.get("xpRequiredForNextLevel")
    achievements = progress_data.get("achievements")

    # Calculate progress towards the next level
    progress_to_next_level = (xp / xp_required_for_next_level) * 100

    # Generate the progress report in Markdown format
    progress_report = f"""
    # Progress Report for {user_name}

    ## Language: {target_language}

    ### Current Level
    - **Level**: {level}
    - **Tier**: {tier}
    - **Prior Experience**: {prior_experience}

    ### Experience (XP)
    - **Current XP**: {xp}
    - **XP Required for Next Level**: {xp_required_for_next_level}
    - **Progress to Next Level**: {progress_to_next_level:.2f}%

    ### Progress Summary
    - **Lessons Completed**: {lessons_completed}

    ### Achievements
    {', '.join(achievements) if achievements else 'No achievements yet.'}

    ---

    **Keep up the great work, {user_name}!** 🚀
    """

    return progress_report.strip()  # Remove leading/trailing whitespace