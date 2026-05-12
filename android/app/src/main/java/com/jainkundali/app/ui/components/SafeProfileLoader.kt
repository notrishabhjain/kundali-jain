package com.jainkundali.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.jainkundali.app.data.preferences.AppPreferences
import com.jainkundali.app.data.repository.ProfileRepository
import com.jainkundali.app.domain.engine.ProfileEngine
import com.jainkundali.app.domain.models.BirthFormData
import com.jainkundali.app.domain.models.UserProfile
import androidx.compose.runtime.collectAsState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class ProfileLoadResult(
    val profile: UserProfile,
    val profileId: Long
)

@Composable
fun WithProfile(
    profileRepository: ProfileRepository,
    appPreferences: AppPreferences,
    loadingContent: @Composable () -> Unit = { DefaultLoadingContent() },
    noProfileContent: @Composable () -> Unit = { DefaultNoProfileContent() },
    content: @Composable (ProfileLoadResult) -> Unit
) {
    var result by remember { mutableStateOf<ProfileLoadResult?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    var hasError by remember { mutableStateOf(false) }

    // Observe profileId as state so LaunchedEffect re-fires on profile switch
    val profileId by appPreferences.selectedProfileId.collectAsState(initial = null)

    LaunchedEffect(profileId) {
        isLoading = true
        hasError = false
        result = null
        try {
            if (profileId != null && profileId!! > 0L) {
                val entity = withContext(Dispatchers.IO) {
                    profileRepository.getById(profileId!!)
                }
                if (entity != null) {
                    val formData = BirthFormData(
                        fullName = entity.name.ifEmpty { "\u0905\u091C\u094D\u091E\u093E\u0924" },
                        dob = entity.dateOfBirth.ifEmpty { "2000-01-01" },
                        time = entity.birthTime.ifEmpty { "12:00" },
                        place = entity.birthPlace.ifEmpty { "\u091C\u092F\u092A\u0941\u0930" },
                        lat = entity.latitude.toString(),
                        lng = entity.longitude.toString(),
                        gender = entity.gender.ifEmpty { "\u092A\u0941\u0930\u0941\u0937" }
                    )
                    val profile = withContext(Dispatchers.Default) {
                        ProfileEngine.generateUserProfile(formData)
                    }
                    result = ProfileLoadResult(profile = profile, profileId = profileId!!)
                }
            }
        } catch (e: Exception) {
            hasError = true
            android.util.Log.e("SafeProfileLoader", "Error loading profile", e)
        } finally {
            isLoading = false
        }
    }

    when {
        isLoading -> loadingContent()
        result != null -> content(result!!)
        else -> noProfileContent()
    }
}

@Composable
private fun DefaultLoadingContent() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
private fun DefaultNoProfileContent() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text(
            text = "\u0915\u0943\u092A\u092F\u093E \u092A\u0939\u0932\u0947 \u090F\u0915 \u092A\u094D\u0930\u094B\u092B\u093C\u093E\u0907\u0932 \u091A\u0941\u0928\u0947\u0902",
            style = MaterialTheme.typography.bodyLarge
        )
    }
}
