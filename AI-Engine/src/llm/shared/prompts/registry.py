from typing import Dict, Any, Tuple
from .versions import STRATEGIC_PROMPTS, EXECUTIVE_PROMPTS, PromptTemplate


class PromptRegistry:
    """
    Registry for managing and rendering system and user prompts across LLM modules.
    Ensures prompt changes are version-controlled and parameterized.
    """

    _prompts: Dict[str, Dict[str, PromptTemplate]] = {
        "strategic_analysis": STRATEGIC_PROMPTS,
        "executive_report": EXECUTIVE_PROMPTS,
    }

    @classmethod
    def get_prompt_template(cls, module: str, version: str = "1.0.0") -> PromptTemplate:
        """
        Retrieve a system and user prompt template for a specific module and version.
        """
        module_prompts = cls._prompts.get(module)
        if not module_prompts:
            raise KeyError(f"Module '{module}' not found in prompt registry.")

        template = module_prompts.get(version)
        if not template:
            # Fallback to the latest version if version doesn't exist
            sorted_versions = sorted(module_prompts.keys(), reverse=True)
            if not sorted_versions:
                raise ValueError(f"No prompts found in registry for module '{module}'.")
            fallback_version = sorted_versions[0]
            template = module_prompts[fallback_version]
            # Log warning or inform
            
        return template

    @classmethod
    def render(cls, module: str, version: str = "1.0.0", **kwargs: Any) -> Tuple[str, str]:
        """
        Render both system and user prompts using the supplied key-value parameters.
        """
        template = cls.get_prompt_template(module, version)
        
        # System prompts might not need format arguments, but we allow them
        try:
            system_prompt = template.system_template.format(**kwargs)
        except KeyError:
            # If placeholders exist in system template but are not provided, we don't format it
            system_prompt = template.system_template
            
        # User prompts are parameterized with evidence data, names, etc.
        try:
            user_prompt = template.user_template.format(**kwargs)
        except KeyError as e:
            raise ValueError(f"Missing required parameter for user prompt formatting: {str(e)}")
            
        return system_prompt, user_prompt
