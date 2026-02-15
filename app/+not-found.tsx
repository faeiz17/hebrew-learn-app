import { Stack } from "expo-router";
import React from "react";

import { ComingSoonTemplate } from "@/templates";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!", headerShown: false }} />
            <ComingSoonTemplate title="Page Not Found" />
        </>
    );
}
