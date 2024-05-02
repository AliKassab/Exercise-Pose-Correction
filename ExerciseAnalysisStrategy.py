from abc import ABC, abstractmethod

class IExerciseAnalysisStrategy(ABC):
    @abstractmethod
    def __init__(self):
        pass
    
    @abstractmethod
    def is_correct(self):
        pass