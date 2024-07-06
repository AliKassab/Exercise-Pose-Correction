from abc import ABC, abstractmethod

class IExerciseAnalysisStrategy(ABC):
    @abstractmethod
    def __init__(self):
        """
        Constructor to initialize the required body angles for evaluation.
         Returns:
            None.
        """
        pass
    
    @abstractmethod
    def correct_form(self) -> str:
        """
        Abstract method to be implemented by subclasses.
         Determines if the exercise needs adjustment or not. 
          if so, it corrects it. 
        Returns: 
            str: stating the angle adjustments
        """
        pass