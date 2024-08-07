import { HandPalm, Play } from "phosphor-react";
import {
  StartCountdownButton,
  HomeContainer,
  StopCountdownButton,
} from "./styles";
import { useContext, useState } from "react";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { FormProvider, useForm } from "react-hook-form";
import { CycleContext } from "../../contexts/CycleContext";


type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, "o ciclo precisa ser no minimo 5 minutos")
    .max(60, "o ciclo precisa ser no maximo 60 minutos"),
});

export function Home() {
  const {activeCycle, createNewCycle, interruptCurrentCycle  } = useContext(CycleContext)
 
  
  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: newCycleFormData) {
    createNewCycle(data);
    reset();
  }
  
  const task = watch("task");

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Parar
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={!task} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
