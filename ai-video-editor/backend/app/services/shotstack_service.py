"""Shotstack API integration for video rendering"""

import requests
import json
from typing import Dict, Any, Optional


class ShotstackService:
    """Integrates with Shotstack API for cloud video rendering"""
    
    def __init__(self, api_key: str):
        """
        Initialize Shotstack service
        
        Args:
            api_key: Shotstack API key
        """
        self.api_key = api_key
        self.base_url = "https://api.shotstack.io/stage"
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key,
        }
    
    def create_edit(
        self,
        video_url: str,
        edits: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Create a video edit with Shotstack
        
        Args:
            video_url: Source video URL
            edits: Dictionary with edit parameters
            
        Returns:
            Response from Shotstack API
        """
        payload = {
            "timeline": {
                "soundtrack": {
                    "src": edits.get("music_url"),
                },
                "tracks": [
                    {
                        "clips": [
                            {
                                "asset": {
                                    "type": "video",
                                    "src": video_url,
                                },
                                "start": 0,
                                "length": edits.get("duration", 30),
                            }
                        ]
                    }
                ],
            },
            "output": {
                "format": "mp4",
                "resolution": "hd",
            },
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/render",
                json=payload,
                headers=self.headers,
            )
            
            if response.status_code == 201:
                return response.json()
            else:
                return {"error": response.text}
        
        except Exception as e:
            return {"error": str(e)}
    
    def get_render_status(self, render_id: str) -> Dict[str, Any]:
        """Get status of a render job"""
        try:
            response = requests.get(
                f"{self.base_url}/render/{render_id}",
                headers=self.headers,
            )
            return response.json()
        except Exception as e:
            return {"error": str(e)}
