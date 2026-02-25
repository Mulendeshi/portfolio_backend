import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    {
        db: { schema: "public" },
    },
);

export default class SupabaseRepository {
    async getRecordById(query: { table: string; id: any }) {
        const { data, error } = await supabase
            .from(query.table)
            .select("*")
            .eq("id", query.id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    }

    async getAllRecords(table: string) {
        
        const { data, error } = await supabase.from(table).select("*");
        if (error) throw new Error(error.message);
        return data;
    }

    async insertRecord(query: { table: string; data: unknown }) {
        const { data, error } = await supabase.from(query.table).insert(
            query.data,
        )
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    }

    async updateRecord(query: { table: string; id: string; updates: unknown }) {
        const { data, error } = await supabase.from(query.table).update(
            query.updates,
        ).eq(
            "id",
            query.id,
        ).select().single();
        if (error) throw new Error(error.message);
        return data;
    }

    async deleteRecord(query: { table: string; id: string }) {
        const { data, error } = await supabase.from(query.table).delete().eq(
            "id",
            query.id,
        ).select().single();
        if (error) throw new Error(error.message);
        return data;
    }

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw new Error(error.message);

        return data;
    }

    async signUp(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) throw new Error(error.message);

        return data;
    }

    async verifyToken(token: any) {
        return await supabase.auth.getUser(token);
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) throw new Error(error.message);

        return true;
    }
}
